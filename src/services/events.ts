import { Event } from '../types';
import { updateAudit } from './audit';
import { fetchWithProxy } from '../utils/proxy';

const cache = new Map<string, any>();

function parseEventsFromDoc(doc: Document, html: string, url: string): Event[] {
  let rows = doc.querySelectorAll('.views-table tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('table.sticky-enabled tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('.view-tour-events table tbody tr');
  if (rows.length === 0) rows = doc.querySelectorAll('table tbody tr');

  if (rows.length === 0) {
    console.warn('Parser Drift: No event rows found at', url);
    updateAudit('events', {
      parserDrift: true,
      lastHtmlSnapshot: html.slice(0, 500),
    });
    return [];
  }

  const events: Event[] = [];

  rows.forEach(row => {
    // Name & ID
    const nameEl =
      row.querySelector('.views-field-title a') ||
      row.querySelector('.views-field-name a') ||
      row.querySelector('td:first-child a');

    if (!nameEl) return;

    const href = nameEl.getAttribute('href') || '';
    const id = href.split('/').filter(Boolean).pop() || '';
    const name = nameEl.textContent?.trim() || '';

    // Date — try multiple field class patterns
    const dateEl =
      row.querySelector('.views-field-date-range') ||
      row.querySelector('.views-field-field-event-date') ||
      row.querySelector('.views-field-start-date') ||
      row.querySelector('.date-display-range') ||
      row.querySelector('[class*="date"]');
    const date = dateEl?.textContent?.trim().replace(/\s+/g, ' ') || '';

    // Location / Venue
    const locationEl =
      row.querySelector('.views-field-field-venue') ||
      row.querySelector('.views-field-field-location') ||
      row.querySelector('.views-field-field-city') ||
      row.querySelector('[class*="venue"]') ||
      row.querySelector('[class*="location"]');
    const location = locationEl?.textContent?.trim().replace(/\s+/g, ' ') || '';

    // Tier / Sanctioning
    const tierEl =
      row.querySelector('.views-field-field-event-tier') ||
      row.querySelector('.views-field-tier') ||
      row.querySelector('.views-field-field-pdga-sanctioned') ||
      row.querySelector('[class*="tier"]');
    const tier = tierEl?.textContent?.trim() || '';

    // Status / Registration
    const statusEl =
      row.querySelector('.views-field-field-registration-status') ||
      row.querySelector('.views-field-status') ||
      row.querySelector('[class*="status"]') ||
      row.querySelector('[class*="registration"]');
    const status = statusEl?.textContent?.trim() || '';

    if (name) {
      events.push({ id, name, date, location, tier, status });
    }
  });

  return events;
}

export async function fetchEvents(state = '', page = 0): Promise<Event[]> {
  const cacheKey = `pdga-events-p${page}`;
  // items_per_page=25 keeps the HTML payload small enough for proxy limits
  const url = `https://www.pdga.com/tour/events?items_per_page=25&page=${page}`;
  const startTime = Date.now();

  if (cache.has(cacheKey)) {
    updateAudit('events', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(cacheKey);
  }

  try {
    const { response, proxyUsed } = await fetchWithProxy(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const events = parseEventsFromDoc(doc, html, url);

    cache.set(cacheKey, events);
    updateAudit('events', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: proxyUsed,
      itemCount: events.length,
    });
    return events;
  } catch (error: any) {
    updateAudit('events', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return [];
  }
}

export async function fetchEventDetail(eventId: string): Promise<Event | null> {
  const url = `https://www.pdga.com/tour/event/${eventId}`;
  const startTime = Date.now();

  if (cache.has(url)) {
    updateAudit('eventDetail', { cacheHit: true, latency: Date.now() - startTime });
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
      console.warn('Parser Drift: Event name not found for', eventId);
      updateAudit('eventDetail', {
        parserDrift: true,
        lastHtmlSnapshot: html.slice(0, 500),
        lastProxyUsed: proxyUsed,
      });
    }

    // Detail page field selectors
    const dateEl =
      doc.querySelector('.field-name-field-event-date') ||
      doc.querySelector('.field--name-field-event-date') ||
      doc.querySelector('.date-display-range');
    const date = dateEl?.textContent?.trim().replace(/\s+/g, ' ') || '';

    const locationEl =
      doc.querySelector('.field-name-field-venue') ||
      doc.querySelector('.field--name-field-venue') ||
      doc.querySelector('.field-name-field-city');
    const location = locationEl?.textContent?.trim().replace(/\s+/g, ' ') || '';

    const tierEl =
      doc.querySelector('.field-name-field-event-tier') ||
      doc.querySelector('.field--name-field-event-tier');
    const tier = tierEl?.textContent?.trim() || '';

    const statusEl =
      doc.querySelector('.field-name-field-registration-status') ||
      doc.querySelector('.field--name-field-registration-status');
    const status = statusEl?.textContent?.trim() || '';

    const event: Event = { id: eventId, name, date, location, tier, status };

    cache.set(url, event);
    updateAudit('eventDetail', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: proxyUsed,
    });
    return event;
  } catch (error: any) {
    updateAudit('eventDetail', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return null;
  }
}
