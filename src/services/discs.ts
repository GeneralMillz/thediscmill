import { Disc } from '../types';
import { updateAudit } from './audit';
import { fetchWithProxy } from '../utils/proxy';

const cache = new Map<string, Disc[]>();
const CACHE_KEY = 'infinite-discs-category';

// Infinite Discs category catalog — returns full product listing
const INFINITE_CATALOG_URL = 'https://infinitediscs.com/Products/Category?start=0&limit=1000';

export async function fetchDiscs(): Promise<Disc[]> {
  const startTime = Date.now();

  if (cache.has(CACHE_KEY)) {
    updateAudit('discs', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(CACHE_KEY)!;
  }

  // Try fetching a broad search from Infinite Discs first
  try {
    const { response, proxyUsed } = await fetchWithProxy(
      INFINITE_CATALOG_URL,
      8000
    );
    const data = await response.json();

    const results: any[] = Array.isArray(data)
      ? data
      : data?.products || data?.results || data?.items || [];

    if (results.length === 0) {
      updateAudit('discs', {
        parserDrift: true,
        lastHtmlSnapshot: JSON.stringify(data).slice(0, 500),
        lastProxyUsed: proxyUsed,
        latency: Date.now() - startTime,
      });
      throw new Error('Parser Drift: Infinite Discs response shape changed');
    }

    const discs: Disc[] = results.map((d: any) => {
      const brand = d.Brand || d.brand || d.Manufacturer || d.manufacturer || 'Unknown';
      const name  = d.Name  || d.name  || d.Title       || d.title       || 'Unknown';
      const bSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const nSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return {
        id: `${bSlug}-${nSlug}`,
        brand,
        name,
        speed: Number(d.Speed ?? d.speed ?? 0),
        glide: Number(d.Glide ?? d.glide ?? 0),
        turn: Number(d.Turn ?? d.turn ?? 0),
        fade: Number(d.Fade ?? d.fade ?? 0),
        category: d.Category || d.category || d.Type || d.type || '',
        stability: d.Stability || d.stability || '',
        description: d.Description || d.description || '',
        image: d.Image || d.image || d.ImageUrl || d.imageUrl || '',
      };
    });

    cache.set(CACHE_KEY, discs);
    updateAudit('discs', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: proxyUsed,
      dataSource: 'live',
      itemCount: discs.length,
    });
    return discs;
  } catch (liveError: any) {
    updateAudit('discs', {
      lastError: liveError.message,
      latency: Date.now() - startTime,
    });
  }

  // Fallback 1: expanded local catalog (reset timer — local load is fast)
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
  } catch {
    // fall through to discs.json
  }

  // Fallback 2: legacy discs.json
  try {
    const legacyStart = Date.now();
    const legacyRes = await fetch('/data/discs.json');
    if (legacyRes.ok) {
      const discs: Disc[] = await legacyRes.json();
      cache.set(CACHE_KEY, discs);
      updateAudit('discs', {
        lastSuccessfulFetch: Date.now(),
        latency: Date.now() - legacyStart,
        cacheHit: false,
        lastProxyUsed: null,
        dataSource: 'local-fallback',
        itemCount: discs.length,
        lastError: null,
      });
      return discs;
    }
  } catch {
    // all sources exhausted
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

export function clearDiscCache(): void {
  cache.clear();
}
