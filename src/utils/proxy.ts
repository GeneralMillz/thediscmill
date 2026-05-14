/**
 * Proxy chain for CORS-bypassing external fetches.
 *
 * Architecture contract: allorigins is the canonical proxy (per docs/ARCHITECTURE.md
 * and src/services/audit.ts PROXY_URL). corsproxy.io is kept as a fallback only.
 *
 * Order matters: the first proxy that returns response.ok wins. allorigins is
 * more reliable for PDGA endpoints; corsproxy.io is the secondary fallback.
 */
const PROXY_CHAIN: Array<{ name: string; wrap: (url: string) => string }> = [
  {
    name: 'corsproxy.io',
    wrap: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  },
  {
    name: 'allorigins',
    wrap: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  },
];

export interface ProxyResult {
  response: Response;
  proxyUsed: string;
}

/**
 * Tries each proxy in PROXY_CHAIN in order, returning on the first success.
 * Throws a structured error if all proxies fail.
 */
export async function fetchWithProxy(url: string, timeoutMs = 10000): Promise<ProxyResult> {
  const errors: string[] = [];

  for (const proxy of PROXY_CHAIN) {
    const proxiedUrl = proxy.wrap(url);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(proxiedUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (response.ok) {
        return { response, proxyUsed: proxy.name };
      }
      errors.push(`${proxy.name}: HTTP ${response.status}`);
    } catch (e: any) {
      clearTimeout(timer);
      const msg = e.name === 'AbortError' ? 'timeout' : e.message;
      errors.push(`${proxy.name}: ${msg}`);
    }
  }

  throw new Error(`All proxies failed — ${errors.join(' | ')}`);
}
