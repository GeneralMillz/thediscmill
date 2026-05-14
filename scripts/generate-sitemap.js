import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const SITE_URL = 'https://thediscmill.com'; // Change to actual production URL

async function generateSitemap() {
  const discsFile = path.join(PUBLIC_DIR, 'data/discs.json');
  const blogFile = path.join(PUBLIC_DIR, 'data/blog.json');
  const coursesFile = path.join(PUBLIC_DIR, 'data/courses.json');
  const dyersFile = path.join(PUBLIC_DIR, 'data/dyers.json');
 
  let discs = [];
  let blogs = [];
  let courses = [];
  let dyers = [];
 
  if (fs.existsSync(discsFile)) {
    discs = JSON.parse(fs.readFileSync(discsFile, 'utf-8'));
  }
  if (fs.existsSync(blogFile)) {
    blogs = JSON.parse(fs.readFileSync(blogFile, 'utf-8'));
  }
  if (fs.existsSync(coursesFile)) {
    courses = JSON.parse(fs.readFileSync(coursesFile, 'utf-8'));
  }
  if (fs.existsSync(dyersFile)) {
    dyers = JSON.parse(fs.readFileSync(dyersFile, 'utf-8'));
  }

  const urls = [];

  // Static routes
  const staticRoutes = [
    { path: '',              priority: '1.0', freq: 'daily'   },
    { path: '/discs',        priority: '0.9', freq: 'daily'   },
    { path: '/manufacturers',priority: '0.8', freq: 'weekly'  },
    { path: '/courses',      priority: '0.7', freq: 'weekly'  },
    { path: '/events',       priority: '0.7', freq: 'daily'   },
    { path: '/players',      priority: '0.6', freq: 'weekly'  },
    { path: '/blog',         priority: '0.8', freq: 'daily'   },
    { path: '/gear',         priority: '0.8', freq: 'weekly'  },
    { path: '/guides',       priority: '0.8', freq: 'weekly'  },
    { path: '/bag-builder',  priority: '0.7', freq: 'monthly' },
    { path: '/disc-finder',  priority: '0.8', freq: 'monthly' },
    { path: '/disc-return',  priority: '0.6', freq: 'monthly' },
    // ── High-intent SEO landing pages ──────────────────────────────────────
    { path: '/best/beginners',        priority: '0.9', freq: 'weekly' },
    { path: '/best/distance-drivers', priority: '0.9', freq: 'weekly' },
    { path: '/best/putters',          priority: '0.9', freq: 'weekly' },
    { path: '/best/midranges',        priority: '0.9', freq: 'weekly' },
    { path: '/best/forehand-discs',   priority: '0.9', freq: 'weekly' },
    { path: '/best/backhand-discs',   priority: '0.9', freq: 'weekly' },
    { path: '/best/wind',             priority: '0.8', freq: 'weekly' },
    { path: '/best/low-power',        priority: '0.9', freq: 'weekly' },
    { path: '/best/high-power',       priority: '0.8', freq: 'weekly' },
    { path: '/best/glow-discs',       priority: '0.8', freq: 'weekly' },
    { path: '/best/lightweight-discs',priority: '0.8', freq: 'weekly' },
    { path: '/best/stable-drivers',   priority: '0.9', freq: 'weekly' },
    // ── Tools ───────────────────────────────────────────────────────────────
    { path: '/recommend', priority: '0.9', freq: 'monthly' },
    { path: '/glossary',  priority: '0.8', freq: 'monthly' },
    { path: '/releases',  priority: '0.7', freq: 'weekly'  },
    { path: '/deals',     priority: '0.7', freq: 'weekly'  },
    { path: '/partners',  priority: '0.6', freq: 'monthly' },
    { path: '/dyers',     priority: '0.8', freq: 'weekly'  },
    // ── State hubs ─────────────────────────────────────────────────────────
    { path: '/michigan',   priority: '0.8', freq: 'weekly' },
    { path: '/texas',      priority: '0.8', freq: 'weekly' },
    { path: '/california', priority: '0.8', freq: 'weekly' },
    { path: '/ohio',       priority: '0.8', freq: 'weekly' },
    { path: '/florida',    priority: '0.8', freq: 'weekly' },
  ];

  staticRoutes.forEach(({ path: route, priority, freq }) => {
    urls.push(`  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`);
  });

  // Dynamic routes - Discs (Brand/Slug structure)
  discs.forEach(disc => {
    // Brand URLs
    const brandSlug = disc.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const discSlug = disc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    urls.push(`  <url>\n    <loc>${SITE_URL}/disc/${brandSlug}/${discSlug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`);
  });

  // Dynamic routes - Manufacturers
  const brands = new Set(discs.map(d => d.brand).filter(Boolean));
  brands.forEach(brand => {
    const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    urls.push(`  <url>\n    <loc>${SITE_URL}/manufacturer/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
  });

  // Dynamic routes - Blog & Guides
  blogs.forEach(post => {
    // If it's a guide, prioritize it higher
    const isGuide = post.category?.toLowerCase().includes('guide');
    urls.push(`  <url>\n    <loc>${SITE_URL}/blog/${post.id}</loc>\n    <changefreq>${isGuide ? 'weekly' : 'monthly'}</changefreq>\n    <priority>${isGuide ? '0.9' : '0.8'}</priority>\n  </url>`);
  });

  // Dynamic routes - Courses
  courses.forEach(course => {
    urls.push(`  <url>\n    <loc>${SITE_URL}/course/${course.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
  });

  // Dynamic routes - Dyers
  dyers.forEach(dyer => {
    urls.push(`  <url>\n    <loc>${SITE_URL}/dyer/${dyer.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(new Set(urls)).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapContent);
  console.log('Generated sitemap.xml');

  // Generate robots.txt
  const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsContent);
  console.log('Generated robots.txt');
}

generateSitemap().catch(console.error);
