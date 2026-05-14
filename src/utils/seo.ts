// ─── Core constants ─────────────────────────────────────────────────────────
export const SITE_NAME = 'The Disc Mill';
export const SITE_URL = 'https://thediscmill.com';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
export const TWITTER_HANDLE = '@thediscmill';

export function buildTitle(page: string): string {
  return `${page} | ${SITE_NAME}`;
}

export function buildCanonical(path: string): string {
  // Normalize trailing slashes; always canonical without trailing slash except root
  const cleaned = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;
  return `${SITE_URL}${cleaned}`;
}

// ─── Entity / Knowledge Graph schemas ───────────────────────────────────────

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 512,
    height: 512,
  },
  description:
    'The Disc Mill is the national disc golf intelligence platform — free, open-data disc database, course finder, player search, and gear guides.',
  sameAs: [
    'https://www.instagram.com/thediscmill',
    'https://www.facebook.com/thediscmill',
    'https://twitter.com/thediscmill',
    'https://www.youtube.com/@thediscmill',
    'https://www.tiktok.com/@thediscmill',
  ],
  knowsAbout: [
    { '@type': 'Thing', name: 'Disc Golf' },
    { '@type': 'Thing', name: 'PDGA Disc Golf' },
    { '@type': 'Thing', name: 'Disc Golf Equipment' },
    { '@type': 'Thing', name: 'Disc Golf Courses' },
  ],
  mentions: [
    { '@type': 'Organization', name: 'Professional Disc Golf Association', url: 'https://www.pdga.com' },
    { '@type': 'Organization', name: 'Infinite Discs', url: 'https://infinitediscs.com' },
    { '@type': 'Organization', name: 'UDisc', url: 'https://udisc.com' },
    { '@type': 'Organization', name: 'Dynamic Discs', url: 'https://www.dynamicdiscs.com' },
    { '@type': 'Organization', name: 'Innova Discs', url: 'https://www.innovadiscs.com' },
    { '@type': 'Organization', name: 'Discraft', url: 'https://www.discraft.com' },
  ],
};

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: 'National disc golf intelligence platform — find discs, courses, players, and events.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/disc-finder?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// ─── Dynamic OG Image Generator (client-side canvas → data URL) ─────────────

export interface OGImageOptions {
  title: string;
  subtitle?: string;
  category?: string;
  badge?: string;
  accentColor?: string;
}

export function generateOGImageDataURL(opts: OGImageOptions): string {
  const { title, subtitle, category, badge, accentColor = '#818cf8' } = opts;

  // Create 1200×630 canvas
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) return DEFAULT_OG_IMAGE;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 1200, 630);
  bg.addColorStop(0, '#050810');
  bg.addColorStop(0.5, '#0c1222');
  bg.addColorStop(1, '#111827');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1200, 630);

  // Grid overlay
  ctx.strokeStyle = 'rgba(148,163,184,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1200; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 630); ctx.stroke();
  }
  for (let y = 0; y < 630; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke();
  }

  // Accent glow
  const glow = ctx.createRadialGradient(200, 200, 0, 200, 200, 400);
  glow.addColorStop(0, `${accentColor}22`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1200, 630);

  // Left accent bar
  ctx.fillStyle = accentColor;
  ctx.fillRect(80, 140, 6, 350);

  // Badge / category pill
  if (badge || category) {
    const pillText = (badge || category || '').toUpperCase();
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    const tw = ctx.measureText(pillText).width;
    ctx.fillStyle = `${accentColor}22`;
    roundRect(ctx, 108, 140, tw + 32, 38, 8);
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
    ctx.fillText(pillText, 124, 164);
  }

  // Title
  ctx.fillStyle = '#f1f5f9';
  const titleFontSize = title.length > 40 ? 56 : title.length > 25 ? 68 : 80;
  ctx.font = `900 ${titleFontSize}px system-ui, -apple-system, sans-serif`;
  const titleLines = wrapText(ctx, title, 108, 240, 980, titleFontSize * 1.2);
  titleLines.forEach((line, i) => {
    ctx.fillText(line.text, line.x, line.y + i * titleFontSize * 1.2);
  });

  // Subtitle
  if (subtitle) {
    ctx.fillStyle = 'rgba(148,163,184,0.7)';
    ctx.font = '300 28px system-ui, -apple-system, sans-serif';
    const subLines = wrapText(ctx, subtitle, 108, titleLines.length * titleFontSize * 1.2 + 260, 900, 36);
    subLines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line.text, line.x, line.y + i * 40);
    });
  }

  // Bottom branding bar
  ctx.fillStyle = `${accentColor}15`;
  ctx.fillRect(0, 550, 1200, 80);
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillText('THE DISC MILL', 80, 598);
  ctx.fillStyle = 'rgba(148,163,184,0.4)';
  ctx.font = '300 18px system-ui, -apple-system, sans-serif';
  ctx.fillText('thediscmill.com', 1200 - 220, 598);

  try {
    return canvas.toDataURL('image/jpeg', 0.9);
  } catch {
    return DEFAULT_OG_IMAGE;
  }
}

// ─── Canvas helpers ──────────────────────────────────────────────────────────

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  const lines: { text: string; x: number; y: number }[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push({ text: currentLine, x, y });
      currentLine = word;
      y += lineHeight;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push({ text: currentLine, x, y });
  return lines;
}

// ─── Internal link cluster definitions ──────────────────────────────────────

export interface LinkCluster {
  label: string;
  href: string;
  description: string;
}

export const TOPICAL_CLUSTERS: Record<string, LinkCluster[]> = {
  disc: [
    { label: 'Browse All Discs', href: '/discs', description: 'Explore the full disc catalog' },
    { label: 'Disc Finder', href: '/disc-finder', description: 'Find the perfect disc for your game' },
    { label: 'Gear Guides', href: '/guides', description: 'Expert gear recommendations' },
  ],
  manufacturer: [
    { label: 'All Manufacturers', href: '/manufacturers', description: 'Browse disc golf brands' },
    { label: 'Disc Finder', href: '/disc-finder', description: 'Find your perfect disc' },
    { label: 'Disc Catalog', href: '/discs', description: 'Browse all PDGA-approved discs' },
  ],
  course: [
    { label: 'Course Directory', href: '/courses', description: 'Find disc golf courses near you' },
    { label: 'PDGA Events', href: '/events', description: 'Tournaments at local courses' },
    { label: 'Player Search', href: '/players', description: 'Find players near you' },
  ],
  event: [
    { label: 'All Events', href: '/events', description: 'PDGA-sanctioned tournaments' },
    { label: 'Course Directory', href: '/courses', description: 'Find host courses' },
    { label: 'Player Search', href: '/players', description: 'Search PDGA members' },
  ],
  blog: [
    { label: 'Gear Guides', href: '/guides', description: 'Expert buying guides' },
    { label: 'Disc Finder', href: '/disc-finder', description: 'Find the right disc' },
    { label: 'Bag Builder', href: '/bag-builder', description: 'Build your perfect bag' },
  ],
  guide: [
    { label: 'All Guides', href: '/guides', description: 'Full gear guide library' },
    { label: 'Disc Catalog', href: '/discs', description: 'Browse PDGA-approved discs' },
    { label: 'Bag Builder', href: '/bag-builder', description: 'Put the gear in your bag' },
  ],
  gear: [
    { label: 'Gear Hub', href: '/gear', description: 'All disc golf gear' },
    { label: 'Buying Guides', href: '/guides', description: 'Expert recommendations' },
    { label: 'Disc Catalog', href: '/discs', description: 'Find the right disc' },
  ],
};

// ─── Schema builder helpers ──────────────────────────────────────────────────

export function buildBreadcrumbs(items: { name: string; item?: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.item ? { item: crumb.item } : {}),
    })),
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildItemListSchema(
  name: string,
  items: { name: string; url?: string; image?: string; description?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { url: item.url } : {}),
      ...(item.image ? { image: item.image } : {}),
      ...(item.description ? { description: item.description } : {}),
    })),
  };
}

export function buildProductSchema(opts: {
  name: string;
  brand: string;
  description?: string;
  url: string;
  image?: string;
  offerUrl?: string;
  category?: string;
  flightNumbers?: { speed: number; glide: number; turn: number; fade: number };
}) {
  const { name, brand, description, url, image, offerUrl, category, flightNumbers } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    brand: { '@type': 'Brand', name: brand },
    description: description ?? (flightNumbers
      ? `${name} by ${brand} — ${category ?? 'Disc Golf Disc'}. Flight numbers: Speed ${flightNumbers.speed}, Glide ${flightNumbers.glide}, Turn ${flightNumbers.turn}, Fade ${flightNumbers.fade}.`
      : undefined),
    url,
    ...(image ? { image } : {}),
    ...(category ? { category: `Disc Golf ${category}` } : {}),
    ...(offerUrl ? {
      offers: {
        '@type': 'Offer',
        url: offerUrl,
        priceCurrency: 'USD',
        availability: 'https://schema.org/OnlineOnly',
        seller: { '@type': 'Organization', name: 'Amazon' },
      },
    } : {}),
  };
}

export function buildSportsActivityLocation(course: {
  name: string;
  url: string;
  city?: string;
  state?: string;
  holes?: number;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: course.name,
    url: course.url,
    ...(course.description ? { description: course.description } : {}),
    ...(course.city || course.state ? {
      address: {
        '@type': 'PostalAddress',
        ...(course.city ? { addressLocality: course.city } : {}),
        ...(course.state ? { addressRegion: course.state } : {}),
        addressCountry: 'US',
      },
    } : {}),
    sport: 'Disc Golf',
  };
}

export function buildSportsEventSchema(event: {
  name: string;
  url: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  organizer?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.name,
    url: event.url,
    sport: 'Disc Golf',
    ...(event.startDate ? { startDate: event.startDate } : {}),
    ...(event.endDate ? { endDate: event.endDate } : {}),
    ...(event.location ? { location: { '@type': 'Place', name: event.location } } : {}),
    organizer: {
      '@type': 'SportsOrganization',
      name: event.organizer ?? 'PDGA',
      url: 'https://www.pdga.com',
    },
  };
}
