import { Disc } from '../types';
import { updateAudit } from './audit';

const cache = new Map<string, Disc[]>();
const CACHE_KEY = 'local-discs-category';

export async function fetchDiscs(): Promise<Disc[]> {
  const startTime = Date.now();

  if (cache.has(CACHE_KEY)) {
    updateAudit('discs', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(CACHE_KEY)!;
  }

  // Fetch strictly from the local expanded catalog
  try {
    const localStart = Date.now();
    const fallbackRes = await fetch('/data/discs_fallback.json');
    if (fallbackRes.ok) {
      const discs: Disc[] = await fallbackRes.json();
      cache.set(CACHE_KEY, discs);
      updateAudit('discs', {
        lastSuccessfulFetch: Date.now(),
        latency: Date.now() - localStart,
        cacheHit: false,
        lastProxyUsed: null,
        dataSource: 'local-fallback',
        itemCount: discs.length,
        lastError: null,
      });
      return discs;
    }
  } catch (error: any) {
    updateAudit('discs', {
      lastError: error.message || 'Failed to fetch local discs.json',
      latency: Date.now() - startTime,
    });
  }

  updateAudit('discs', {
    lastError: 'All disc data sources failed',
    latency: Date.now() - startTime,
    dataSource: 'none',
  });
  return [];
}

export async function fetchDiscById(id: string): Promise<Disc | null> {
  const all = await fetchDiscs();
  return all.find(d => d.id === id) ?? null;
}

export async function fetchDiscBySlug(brandSlug: string, discSlug: string): Promise<Disc | null> {
  const all = await fetchDiscs();
  return all.find(d => {
    const dBrandSlug = d.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const dDiscSlug = d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return dBrandSlug === brandSlug && dDiscSlug === discSlug;
  }) ?? null;
}

export function clearDiscCache(): void {
  cache.clear();
}
