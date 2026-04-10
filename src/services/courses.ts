import { Course } from '../types';
import { updateAudit } from './audit';
import { fetchWithProxy } from '../utils/proxy';

const cache = new Map<string, any>();

// ---------------------------------------------------------------------------
// HTML parser — PDGA course directory listing page
// Selector cascade covers both legacy Drupal Views table layout and the
// current div/list layout used by PDGA's updated theme.
// ---------------------------------------------------------------------------
function parseCoursesFromDoc(doc: Document, html: string, url: string): Course[] {
  // ── Row selectors: table rows first, then Drupal Views div-list rows ───────
  let rows = doc.querySelectorAll('.views-table tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('table.sticky-enabled tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('.view-course-directory table tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('table tbody tr');
  // Drupal Views unformatted / list style (no table)
  if (rows.length === 0) rows = doc.querySelectorAll('.view-course-directory .views-row');
  if (rows.length === 0) rows = doc.querySelectorAll('.view-content .views-row');
  if (rows.length === 0) rows = doc.querySelectorAll('.views-row');

  if (rows.length === 0) {
    console.warn('Parser Drift: No course rows found at', url);
    updateAudit('courses', {
      parserDrift: true,
      lastHtmlSnapshot: html.slice(0, 500),
    });
    return [];
  }

  const courses: Course[] = [];
  rows.forEach(row => {
    // ── Name & ID ─────────────────────────────────────────────────────────────
    const nameEl =
      row.querySelector('.views-field-title a') ||
      row.querySelector('.views-field-name a') ||
      row.querySelector('.field-content a') ||
      row.querySelector('td:first-child a') ||
      row.querySelector('a[href*="/course-directory/course/"]');

    if (!nameEl) return;

    const href = nameEl.getAttribute('href') || '';
    const id = href.split('/').filter(Boolean).pop() || '';
    const name = nameEl.textContent?.trim() || '';
    if (!name) return;

    // ── Location (city/state combined) ────────────────────────────────────────
    const locationEl =
      row.querySelector('.views-field-address') ||
      row.querySelector('.views-field-field-address') ||
      row.querySelector('.views-field-field-course-city') ||
      row.querySelector('.views-field-field-location') ||
      row.querySelector('.views-field-field-city-state');
    const location = locationEl?.textContent?.trim().replace(/\s+/g, ' ') || '';

    // ── Holes ─────────────────────────────────────────────────────────────────
    const holesEl =
      row.querySelector('.views-field-field-course-holes') ||
      row.querySelector('.views-field-holes') ||
      row.querySelector('.views-field-field-number-holes') ||
      row.querySelector('[class*="holes"]');
    const holes = parseInt(holesEl?.textContent?.trim() || '0', 10);

    // ── State — explicit field first, then derive from location string ─────────
    const stateEl =
      row.querySelector('.views-field-field-course-state') ||
      row.querySelector('.views-field-field-state');
    const stateText = stateEl?.textContent?.trim() || '';

    const parts = location.split(',');
    const city = parts[0]?.trim() || '';

    // Derive state: prefer explicit field, then last comma-segment, then
    // extract 2-letter abbreviation from patterns like "City, MI 49506"
    let state = stateText;
    if (!state && parts.length >= 2) {
      const rawSeg = parts[parts.length - 1].trim();
      // Match a 2-letter uppercase state abbreviation within the segment
      const abbr = rawSeg.match(/\b([A-Z]{2})\b/);
      state = abbr ? abbr[1] : rawSeg.split(' ')[0] || '';
    }

    courses.push({
      id,
      name,
      location,
      city,
      state: state.toUpperCase().slice(0, 2),
      holes: isNaN(holes) ? 0 : holes,
      rating: 0,
      coordinates: null,
      difficulty: 'Unknown',
      tags: [],
      description: '',
    });
  });

  return courses;
}

// ---------------------------------------------------------------------------
// Extract lat/lng from a PDGA detail page
// Tries JSON-LD → Google Maps embed → Leaflet init script
// ---------------------------------------------------------------------------
function extractCoordinates(doc: Document): { lat: number; lng: number } | null {
  // 1. JSON-LD schema (most reliable when present)
  const ldScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  for (const el of Array.from(ldScripts)) {
    try {
      const data = JSON.parse(el.textContent || '{}');
      const geo = data?.geo || data?.location?.geo;
      if (geo?.latitude && geo?.longitude) {
        return { lat: parseFloat(geo.latitude), lng: parseFloat(geo.longitude) };
      }
    } catch {
      // malformed JSON-LD — skip
    }
  }

  // 2. Google Maps iframe embed: ?q=lat,lng or &ll=lat,lng
  const iframes = doc.querySelectorAll('iframe');
  for (const iframe of Array.from(iframes)) {
    const src = iframe.getAttribute('src') || '';
    if (!src.includes('google') && !src.includes('maps')) continue;
    let m = src.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (!m) m = src.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (!m) m = src.match(/[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  }

  // 3. Leaflet / OpenLayers map init in inline <script>
  const scripts = doc.querySelectorAll('script:not([src])');
  for (const s of Array.from(scripts)) {
    const text = s.textContent || '';
    // Leaflet: L.marker([lat, lng]) or setView([lat, lng])
    const m =
      text.match(/setView\s*\(\s*\[(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/) ||
      text.match(/L\.marker\s*\(\s*\[(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/) ||
      text.match(/"latitude"\s*:\s*"?(-?\d+\.?\d*)"?\s*,\s*"longitude"\s*:\s*"?(-?\d+\.?\d*)"?/);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Live directory fetch — primary data source
// Fetches up to maxPages pages from PDGA, stops on empty page.
// ---------------------------------------------------------------------------
export async function fetchCourseDirectory(state = ''): Promise<Course[]> {
  const CACHE_KEY = `pdga-course-directory-${state || 'all'}`;
  const startTime = Date.now();

  if (cache.has(CACHE_KEY)) {
    updateAudit('courses', {
      cacheHit: true,
      latency: Date.now() - startTime,
      dataSource: 'cache',
      itemCount: cache.get(CACHE_KEY).length,
    });
    return cache.get(CACHE_KEY);
  }

  const allCourses: Course[] = [];
  const MAX_PAGES = 20; // always fetch full directory; state narrowing is client-side only

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const url = `https://www.pdga.com/course-directory/all?page=${page}`;

      if (cache.has(url)) {
        allCourses.push(...cache.get(url));
        continue;
      }

      const { response, proxyUsed } = await fetchWithProxy(url, 25000);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const pageCourses = parseCoursesFromDoc(doc, html, url);

      if (pageCourses.length === 0) {
        // Empty page means we've hit the end (or drift)
        updateAudit('courses', { lastProxyUsed: proxyUsed });
        break;
      }

      cache.set(url, pageCourses);
      allCourses.push(...pageCourses);
      updateAudit('courses', { lastProxyUsed: proxyUsed });
    }

    if (allCourses.length > 0) {
      cache.set(CACHE_KEY, allCourses);
      updateAudit('courses', {
        lastSuccessfulFetch: Date.now(),
        latency: Date.now() - startTime,
        cacheHit: false,
        lastError: null,
        parserDrift: false,
        dataSource: 'live',
        itemCount: allCourses.length,
      });
      return allCourses;
    }

    // Live returned nothing — fall through to local fallback
    updateAudit('courses', {
      lastError: 'PDGA returned 0 courses — parser may have drifted',
      latency: Date.now() - startTime,
      parserDrift: true,
      dataSource: 'none',
    });
  } catch (error: any) {
    updateAudit('courses', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
  }

  // ---------------------------------------------------------------------------
  // Emergency fallback — local JSON. Reset latency timer so the dashboard
  // reflects local load speed, not the failed live attempt.
  // ---------------------------------------------------------------------------
  try {
    const localStart = Date.now();
    const res = await fetch('/data/courses_fallback.json');
    if (res.ok) {
      const courses: Course[] = await res.json();
      cache.set(CACHE_KEY, courses);
      updateAudit('courses', {
        lastSuccessfulFetch: Date.now(),
        latency: Date.now() - localStart,
        cacheHit: false,
        lastProxyUsed: null,
        dataSource: 'local-fallback',
        itemCount: courses.length,
        lastError: null,
      });
      return courses;
    }
  } catch {
    // fallback also unavailable
  }

  updateAudit('courses', {
    lastError: 'All course data sources exhausted',
    dataSource: 'none',
  });
  return [];
}

// ---------------------------------------------------------------------------
// Course detail — extracts description, holes, and coordinates from PDGA page
// ---------------------------------------------------------------------------
export async function fetchCourseDetail(courseId: string): Promise<Course | null> {
  const url = `https://www.pdga.com/course-directory/course/${courseId}`;
  const startTime = Date.now();

  if (cache.has(url)) {
    updateAudit('courseDetail', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(url);
  }

  try {
    const { response, proxyUsed } = await fetchWithProxy(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const name =
      doc.querySelector('h1.page-title')?.textContent?.trim() ||
      doc.querySelector('h1')?.textContent?.trim() ||
      '';

    if (!name) {
      console.warn('Parser Drift: Course name not found for', courseId);
      updateAudit('courseDetail', {
        parserDrift: true,
        lastHtmlSnapshot: html.slice(0, 500),
        lastProxyUsed: proxyUsed,
      });
    }

    const description =
      doc.querySelector('.field-name-field-course-description')?.textContent?.trim() ||
      doc.querySelector('.field--name-field-course-description')?.textContent?.trim() ||
      '';

    const holesEl =
      doc.querySelector('.field-name-field-course-holes') ||
      doc.querySelector('.field--name-field-course-holes');
    const holes = parseInt(holesEl?.textContent?.replace(/\D/g, '') || '0', 10);

    // Rating from PDGA's star/numeric field
    const ratingEl =
      doc.querySelector('.field-name-field-course-rating') ||
      doc.querySelector('.field--name-field-course-rating');
    const rating = parseFloat(ratingEl?.textContent?.replace(/[^\d.]/g, '') || '0');

    // City / state fields
    const cityEl =
      doc.querySelector('.field-name-field-course-city') ||
      doc.querySelector('.field--name-field-course-city');
    const stateEl =
      doc.querySelector('.field-name-field-course-state') ||
      doc.querySelector('.field--name-field-course-state');
    const city = cityEl?.textContent?.trim() || '';
    const state = stateEl?.textContent?.trim() || '';

    const coordinates = extractCoordinates(doc);

    const course: Course = {
      id: courseId,
      name,
      location: [city, state].filter(Boolean).join(', '),
      city,
      state,
      holes: isNaN(holes) ? 0 : holes,
      rating: isNaN(rating) ? 0 : rating,
      coordinates,
      difficulty: '',
      tags: [],
      description,
    };

    cache.set(url, course);
    updateAudit('courseDetail', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: proxyUsed,
      dataSource: 'live',
    });

    return course;
  } catch (error: any) {
    updateAudit('courseDetail', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return null;
  }
}
