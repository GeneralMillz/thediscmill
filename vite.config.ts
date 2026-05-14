import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import prerender from '@prerenderer/rollup-plugin';
import JSDOMRenderer from '@prerenderer/renderer-jsdom';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Read dynamic routes for blog/guides/manufacturers
  let extraRoutes = [];
  try {
    const blogData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'public/data/blog.json'), 'utf-8'));
    const discsData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'public/data/discs.json'), 'utf-8'));
    
    // Blog posts & Guides
    extraRoutes.push(...blogData.map(post => `/blog/${post.id}`));
    
    // Manufacturers
    const brands = new Set(discsData.map(d => d.brand).filter(Boolean));
    brands.forEach(brand => {
      const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      extraRoutes.push(`/manufacturer/${slug}`);
    });
  } catch(e) {
    console.warn("Could not load dynamic data for prerendering");
  }

  return {
    plugins: [
      react(), 
      tailwindcss(),
      // Prerender all major routes to static HTML for SEO (Vercel compatible via JSDOM)
      mode === 'production' && prerender({
        routes: [
          '/', '/discs', '/courses', '/gear', '/blog', '/disc-finder', '/analyzer', '/disc-return', '/bag-builder', '/manufacturers', '/players', '/events',
          ...extraRoutes
        ],
        renderer: new JSDOMRenderer({
          renderAfterTime: 1200,
        }),
        postProcess(renderedRoute) {
          renderedRoute.html = renderedRoute.html.replace(
            '<div id="root">',
            '<div id="root" data-server-rendered="true">'
          );
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
