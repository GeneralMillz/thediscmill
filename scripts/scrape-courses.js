import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COURSES_JSON_PATH = path.resolve(__dirname, '../public/data/courses.json');

function parseCoursesFromDoc(doc, html, url) {
  let rows = doc.querySelectorAll('.views-table tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('table.sticky-enabled tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('.view-course-directory table tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('table tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('.view-course-directory .views-row');
  if (rows.length === 0) rows = doc.querySelectorAll('.view-content .views-row');
  if (rows.length === 0) rows = doc.querySelectorAll('.views-row');

  if (rows.length === 0) {
    console.warn(`No course rows found at ${url}`);
    return [];
  }

  const courses = [];
  rows.forEach(row => {
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

    const locationEl =
      row.querySelector('.views-field-address') ||
      row.querySelector('.views-field-field-address') ||
      row.querySelector('.views-field-field-course-city') ||
      row.querySelector('.views-field-field-location') ||
      row.querySelector('.views-field-field-city-state');
    const location = locationEl?.textContent?.trim().replace(/\s+/g, ' ') || '';

    const holesEl =
      row.querySelector('.views-field-field-course-holes') ||
      row.querySelector('.views-field-holes') ||
      row.querySelector('.views-field-field-number-holes') ||
      row.querySelector('[class*="holes"]');
    const holes = parseInt(holesEl?.textContent?.trim() || '0', 10);

    const stateEl =
      row.querySelector('.views-field-field-course-state') ||
      row.querySelector('.views-field-field-state');
    const stateText = stateEl?.textContent?.trim() || '';

    const parts = location.split(',');
    const city = parts[0]?.trim() || '';

    let state = stateText;
    if (!state && parts.length >= 2) {
      const rawSeg = parts[parts.length - 1].trim();
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

async function main() {
  console.log('Starting full course directory scrape with Puppeteer...');
  
  // Try to load existing data to resume or append
  let allCourses = [];
  if (fs.existsSync(COURSES_JSON_PATH)) {
    try {
      allCourses = JSON.parse(fs.readFileSync(COURSES_JSON_PATH, 'utf-8'));
      console.log(`Loaded ${allCourses.length} existing courses.`);
    } catch (e) {
      console.log('Starting fresh database.');
    }
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // PDGA has ~10,000+ courses. At 20 per page, that's ~500+ pages.
  // We'll scrape up to a max limit or until an empty page.
  const MAX_PAGES_TO_SCRAPE = 1000;
  let newCoursesScraped = 0;

  for (let pageNum = 0; pageNum < MAX_PAGES_TO_SCRAPE; pageNum++) {
    const url = `https://www.pdga.com/course-directory/all?page=${pageNum}`;
    console.log(`Scraping page ${pageNum}...`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      const html = await page.content();
      const dom = new JSDOM(html);
      const pageCourses = parseCoursesFromDoc(dom.window.document, html, url);
      
      if (pageCourses.length === 0) {
        // Double check if we got blocked by looking for standard Cloudflare/Incapsula signs
        if (html.includes('Cloudflare') || html.includes('Incapsula') || html.includes('Access Denied')) {
          console.error(`PDGA Bot Protection Triggered on page ${pageNum}!`);
        } else {
          console.log(`Hit empty page at ${pageNum}. Scrape complete.`);
        }
        break;
      }
      
      // Deduplicate before adding
      for (const course of pageCourses) {
        if (!allCourses.find(c => c.id === course.id)) {
          allCourses.push(course);
          newCoursesScraped++;
        }
      }
      
      // Save progress every page
      fs.writeFileSync(COURSES_JSON_PATH, JSON.stringify(allCourses, null, 2));
      
      // Throttle to respect proxy/target limits and avoid blocks
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`Failed on page ${pageNum}:`, error.message);
      console.log('Stopping scrape early to save progress.');
      break;
    }
  }
  
  await browser.close();
  console.log(`\n✅ Scrape complete. Added ${newCoursesScraped} new courses.`);
  console.log(`Total courses in database: ${allCourses.length}`);
}

main();
