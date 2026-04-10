export interface Disc {
  id: string;
  brand: string;
  name: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
  category: string;
  stability: string;
  description?: string;
  image?: string;
  /** Direct amzn.to short link — overrides search-based link when present. */
  amazonShort?: string;
  /** Canonical Amazon search phrase (e.g. "Innova Aviar disc golf putter"). Used when no amazonShort is set. */
  amazonQuery?: string;
}

export interface Course {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  holes: number;
  rating: number;
  coordinates: { lat: number; lng: number } | null;
  difficulty: string;
  tags: string[];
  description: string;
}

export interface Player {
  id: string;
  name: string;
  pdgaNumber: string;
  rating: number;
  location: string;
  classification: string;
  memberSince: string;
  careerWins: number;
  careerEarnings: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  tier: string;
  status: string;
}

export interface Round {
  eventId: string;
  roundNumber: number;
  scores: any[];
}

export interface Manufacturer {
  id: string;
  name: string;
  shortName: string;
  country: string;
  website: string;
  founded: number | null;
  description: string;
  trilogy?: boolean;
  mvpFamily?: boolean;
}

export interface ServiceAudit {
  lastSuccessfulFetch: number | null;
  lastError: string | null;
  lastProxyUsed: string | null;
  lastHtmlSnapshot: string | null;
  latency: number;
  cacheHit: boolean;
  parserDrift: boolean;
  totalCalls: number;
  totalCacheHits: number;
  /** 'live' | 'local' | 'local-fallback' | 'cache' */
  dataSource?: string;
  /** Number of items loaded (discs, courses, etc.) */
  itemCount?: number;
}

export interface AuditStore {
  [serviceName: string]: ServiceAudit;
}
