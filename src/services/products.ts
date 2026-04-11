import { updateAudit } from './audit';

export interface Product {
  id: string;
  name: string;
  brand: string;
  type: 'disc' | 'bag' | 'shoe' | 'accessory' | 'training';
  role: 'putter' | 'midrange' | 'fairway' | 'driver' | 'starter-set' | 'other';
  asin?: string;
  sku?: string;
  flight?: {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  };
  beginnerNotes?: string;
  sponsored?: boolean;
  /** Monetization provider ID (e.g. 'mvp-dropship'). Scaffolding — unused by UI. */
  providerId?: string;
  /** How this product is monetized. Scaffolding — unused by UI. */
  monetizationType?: 'affiliate' | 'dropship';
  price?: string;
  description?: string;
  image?: string;
}

const cache = new Map<string, Product[]>();
const CACHE_KEY = 'products';

export async function fetchProducts(): Promise<Product[]> {
  const startTime = Date.now();

  if (cache.has(CACHE_KEY)) {
    updateAudit('products', { cacheHit: true, latency: Date.now() - startTime });
    return cache.get(CACHE_KEY)!;
  }

  try {
    const response = await fetch('/data/products.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (!Array.isArray(data)) {
      updateAudit('products', {
        parserDrift: true,
        lastHtmlSnapshot: JSON.stringify(data).slice(0, 500),
        latency: Date.now() - startTime,
      });
      throw new Error('Parser Drift: products.json is not an array');
    }

    // Schema validation — each product must have id, name, brand, type
    const valid = data.filter((p: any) => p?.id && p?.name && p?.brand && p?.type);
    if (valid.length < data.length) {
      console.warn(`Parser Drift: ${data.length - valid.length} products failed schema validation`);
    }

    cache.set(CACHE_KEY, valid);
    updateAudit('products', {
      lastSuccessfulFetch: Date.now(),
      latency: Date.now() - startTime,
      cacheHit: false,
      lastError: null,
      lastProxyUsed: null,
      dataSource: 'local',
      itemCount: valid.length,
    });

    return valid;
  } catch (error: any) {
    updateAudit('products', {
      lastError: error.message,
      latency: Date.now() - startTime,
    });
    return [];
  }
}
