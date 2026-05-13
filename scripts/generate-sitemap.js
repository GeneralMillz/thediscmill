import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const SITE_URL = 'https://thediscmill.com'; // Change to actual production URL

async function generateSitemap() {
  const discsFile = path.join(PUBLIC_DIR, 'data/discs_fallback.json');
  const blogFile = path.join(PUBLIC_DIR, 'data/blog.json');

  let discs = [];
  let blogs = [];

  if (fs.existsSync(discsFile)) {
    discs = JSON.parse(fs.readFileSync(discsFile, 'utf-8'));
  }
  if (fs.existsSync(blogFile)) {
    blogs = JSON.parse(fs.readFileSync(blogFile, 'utf-8'));
  }

  const urls = [];

  // Static routes
  const staticRoutes = [
    '', '/discs', '/manufacturers', '/courses', '/events', '/players', '/blog', '/gear', '/guides'
  ];

  staticRoutes.forEach(route => {
    urls.push(`  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>`);
  });

  // Dynamic routes - Discs (old and new URL structure)
  discs.forEach(disc => {
    urls.push(`  <url>\n    <loc>${SITE_URL}/disc/${disc.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`);
    
    // Brand URLs
    const brandSlug = disc.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const discSlug = disc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    urls.push(`  <url>\n    <loc>${SITE_URL}/disc/${brandSlug}/${discSlug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`);
  });

  // Dynamic routes - Manufacturers
  const brands = new Set(discs.map(d => d.brand));
  brands.forEach(brand => {
    const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    urls.push(`  <url>\n    <loc>${SITE_URL}/manufacturer/${slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
  });

  // Dynamic routes - Blog
  blogs.forEach(post => {
    urls.push(`  <url>\n    <loc>${SITE_URL}/blog/${post.id}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
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
