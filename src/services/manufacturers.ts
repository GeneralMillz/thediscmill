import { Manufacturer } from '../types';
import { updateAudit } from './audit';

const cache = new Map<string, Manufacturer[]>();
const CACHE_KEY = 'manufacturers';

export async function fetchManufacturers(): Promise<Manufacturer[]> {
  const startTime = Date.now();

  if (cache.has(CACHE_KEY)) {
    updateAudit('manufacturers', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(CACHE_KEY)!;
  }

  try {
    const response = await fetch('/data/manufacturers.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data)) {
      updateAudit('manufacturers', {
        parserDrift: true,
        lastHtmlSnapshot: JSON.stringify(data).slice(0, 500),
        latency: Date.now() - startTime,
      });
      throw new Error('Parser Drift: manufacturers.json is not an array');
    }

    // Deduplicate by id (the JSON currently has a duplicate kastaplast entry)
    const seen = new Set<string>();
    const manufacturers: Manufacturer[] = data.filter((m: any) => {
      if (!m?.id || !m?.name) return false;
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    cache.set(CACHE_KEY, manufacturers);
    updateAudit('manufacturers', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: null,
      dataSource: 'local',
      itemCount: manufacturers.length,
    });

    return manufacturers;
  } catch (error: any) {
    updateAudit('manufacturers', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return [];
  }
}

export function getManufacturerById(
  manufacturers: Manufacturer[],
  id: string
): Manufacturer | undefined {
  return manufacturers.find(m => m.id === id);
}

export function getManufacturerByName(
  manufacturers: Manufacturer[],
  name: string
): Manufacturer | undefined {
  const lower = name.toLowerCase();
  return manufacturers.find(
    m =>
      m.name.toLowerCase() === lower ||
      m.shortName.toLowerCase() === lower ||
      lower.includes(m.shortName.toLowerCase())
  );
}
