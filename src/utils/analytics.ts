declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Log a standard event to GA4
 */
export function logEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    // Console log for local dev
    console.debug(`[Analytics] ${eventName}`, params);
  }
}

/**
 * Assign a user to a specific variant for A/B testing, persisting via localStorage.
 */
export function useABTest(testName: string, variants: string[]): string {
  if (typeof window === 'undefined') return variants[0];
  
  const storageKey = `ab_test_${testName}`;
  const existing = localStorage.getItem(storageKey);
  
  if (existing && variants.includes(existing)) {
    return existing;
  }
  
  // Random assignment
  const assigned = variants[Math.floor(Math.random() * variants.length)];
  localStorage.setItem(storageKey, assigned);
  
  // Log assignment event
  logEvent('experiment_assignment', {
    experiment_name: testName,
    variant: assigned
  });
  
  return assigned;
}
