const TAG = 'thediscmill-20';

/**
 * Generates a formatted Amazon affiliate link.
 * @param asinOrUrl - An Amazon ASIN (e.g., "B07897Y67R") or a full Amazon URL.
 * @returns A formatted affiliate link with the thediscmill-20 tag.
 */
export function amazonLink(asinOrUrl: string): string {
  // Check if it's a full URL
  if (asinOrUrl.startsWith('http')) {
    const url = new URL(asinOrUrl);
    url.searchParams.set('tag', TAG);
    return url.toString();
  }

  // Otherwise treat as ASIN
  return `https://www.amazon.com/dp/${asinOrUrl}/?tag=${TAG}`;
}

export interface AmazonLinkOptions {
  /** Direct amzn.to short link — used as-is if present (highest priority). */
  amazonShort?: string;
  /** Raw ASIN — builds a /dp/ product URL. */
  asin?: string;
  /** Search phrase — builds an Amazon search URL. */
  amazonQuery?: string;
}

/**
 * Builds an affiliate link from structured options, with a priority cascade:
 * amazonShort → asin → amazonQuery → null
 */
export function buildAmazonLink(opts: AmazonLinkOptions): string | null {
  if (opts.amazonShort) return opts.amazonShort;
  if (opts.asin)        return amazonLink(opts.asin);
  if (opts.amazonQuery) return `https://www.amazon.com/s?k=${encodeURIComponent(opts.amazonQuery)}&tag=${TAG}`;
  return null;
}
