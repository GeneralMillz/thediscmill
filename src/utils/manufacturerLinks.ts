import { brandSlug } from './brandSlug';

/**
 * Manufacturer domains that should receive referral tagging.
 */
const MANUFACTURER_DOMAINS = [
  'kastaplast.com',
  'kastaplast.se',
  'discraft.com',
  'mvpdiscsports.com',
  'axiomdiscs.com',
  'dynamicdiscs.com',
  'latitude64.se',
  'discmania.net',
  'innovadiscs.com',
  'prodigydisc.com',
  'westside-discs.com',
  'streamlinediscs.com',
  'mintdiscs.com',
  'thoughtspaceathletics.com',
  'lonestardiscs.com',
];

export interface ManufacturerLinkOptions {
  url: string;
  brandName: string;
  pageType: 'manufacturer_hub' | 'disc_detail' | 'best_of' | 'comparison' | 'similar' | 'releases' | 'deals';
  discSlug?: string;
}

/**
 * Adds DiscMill referral UTM parameters to manufacturer links.
 * 
 * Rules:
 * - Only applied to manufacturer-owned domains.
 * - Never applied to retailer links (Amazon, OTB, Infinite, etc.).
 */
export function buildManufacturerLink(opts: ManufacturerLinkOptions): string {
  const { url, brandName, pageType, discSlug } = opts;
  if (!url) return '';

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase().replace('www.', '');
    
    // Only tag if it matches a known manufacturer domain
    const isManufacturerDomain = MANUFACTURER_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    );

    if (!isManufacturerDomain) return url;

    const mfgSlug = brandSlug(brandName);

    urlObj.searchParams.set('utm_source', 'DiscMill');
    urlObj.searchParams.set('utm_medium', 'referral');
    urlObj.searchParams.set('utm_campaign', pageType);
    urlObj.searchParams.set('utm_content', mfgSlug);
    if (discSlug) {
      urlObj.searchParams.set('utm_term', discSlug);
    }

    return urlObj.toString();
  } catch {
    return url;
  }
}
