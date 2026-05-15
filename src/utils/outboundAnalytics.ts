/**
 * Outbound Click Analytics Utility
 * Tracks clicks to manufacturer websites for business development and traffic proof.
 */

export interface OutboundClickEvent {
  manufacturer?: string;
  category?: string;
  label?: string;
  url: string;
  pageSource: string;
  timestamp: number;
}

/**
 * Generic outbound click tracker.
 */
export async function trackOutboundClick(data: Omit<OutboundClickEvent, 'timestamp'>) {
  // Prevent logging example data
  if (data.url.includes('example.com') || data.url.includes('sample')) {
    return;
  }

  const event: OutboundClickEvent = {
    ...data,
    timestamp: Date.now()
  };

  console.log('[Analytics] Outbound:', event);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'outbound_click', {
      event_category: data.category || 'Outbound Link',
      event_label: data.label || data.manufacturer || 'Click',
      link_url: data.url,
      page_source: data.pageSource
    });
  }
}

/**
 * Tracks a manufacturer click (Legacy wrapper).
 */
export async function trackManufacturerClick(manufacturer: string, url: string, pageSource: string) {
  return trackOutboundClick({ manufacturer, url, pageSource });
}
