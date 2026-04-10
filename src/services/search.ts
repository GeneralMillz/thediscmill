import { updateAudit } from './audit';
import { fetchWithProxy } from '../utils/proxy';

const cache = new Map<string, any>();

export async function searchPDGA(query: string) {
  const url = `https://www.pdga.com/search?query=${encodeURIComponent(query)}`;
  const startTime = Date.now();

  if (cache.has(url)) {
    updateAudit('search', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(url);
  }

  try {
    const { response, proxyUsed } = await fetchWithProxy(url);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Try multiple result container selectors
    let resultEls = doc.querySelectorAll('.search-result');
    if (resultEls.length === 0) resultEls = doc.querySelectorAll('.views-row');
    if (resultEls.length === 0) resultEls = doc.querySelectorAll('.search-snippet-info');

    const resultsCount = resultEls.length;

    if (resultsCount === 0 && html.length < 1000) {
      console.warn('Parser Drift: Search results page seems empty for', query);
      updateAudit('search', {
        parserDrift: true,
        lastHtmlSnapshot: html.slice(0, 500),
        lastProxyUsed: proxyUsed,
        latency: Date.now() - startTime,
      });
    }

    const items: Array<{ title: string; url: string; snippet: string }> = [];
    resultEls.forEach(el => {
      const titleEl = el.querySelector('h3 a') || el.querySelector('.search-snippet-info a') || el.querySelector('a');
      const snippetEl = el.querySelector('.search-snippet') || el.querySelector('p');
      if (titleEl) {
        items.push({
          title: titleEl.textContent?.trim() || '',
          url: titleEl.getAttribute('href') || '',
          snippet: snippetEl?.textContent?.trim() || '',
        });
      }
    });

    const results = { query, count: resultsCount, results: items };
    cache.set(url, results);

    updateAudit('search', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: proxyUsed,
    });

    return results;
  } catch (error: any) {
    updateAudit('search', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return { query, count: 0, results: [] };
  }
}
