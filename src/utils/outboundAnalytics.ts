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
  const event: OutboundClickEvent = {
    ...data,
    timestamp: Date.now()
  };

  console.log('[Analytics] Outbound:', event);

  try {
    await fetch('/api/outbound-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  } catch (error) {
    // Fallback to local
    const existing = JSON.parse(localStorage.getItem('outbound_clicks') || '[]');
    existing.push(event);
    localStorage.setItem('outbound_clicks', JSON.stringify(existing));
  }
}

/**
 * Tracks a manufacturer click (Legacy wrapper).
 */
export async function trackManufacturerClick(manufacturer: string, url: string, pageSource: string) {
  return trackOutboundClick({ manufacturer, url, pageSource });
}
