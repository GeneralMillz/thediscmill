import { AuditStore, ServiceAudit } from '../types';

const auditStore: AuditStore = {};

export function updateAudit(serviceName: string, audit: Partial<ServiceAudit>) {
  const current = auditStore[serviceName] || {
    lastSuccessfulFetch: null,
    lastError: null,
    lastProxyUsed: null,
    lastHtmlSnapshot: null,
    latency: 0,
    cacheHit: false,
    parserDrift: false,
    totalCalls: 0,
    totalCacheHits: 0,
  };
  
  const next = { ...current, ...audit };
  
  // Increment stats if this was a new call
  if (audit.latency !== undefined) {
    next.totalCalls = current.totalCalls + 1;
    if (audit.cacheHit) {
      next.totalCacheHits = current.totalCacheHits + 1;
    }
  }
  
  auditStore[serviceName] = next;
}

export function getAudit(serviceName: string): ServiceAudit {
  return auditStore[serviceName] || {
    lastSuccessfulFetch: null,
    lastError: null,
    lastProxyUsed: null,
    lastHtmlSnapshot: null,
    latency: 0,
    cacheHit: false,
    parserDrift: false,
    totalCalls: 0,
    totalCacheHits: 0,
  };
}

export function getAllAudits(): AuditStore {
  return auditStore;
}

export const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export function wrapProxy(url: string): string {
  return `${PROXY_URL}${encodeURIComponent(url)}`;
}
