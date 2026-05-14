import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import prerender from '@prerenderer/rollup-plugin';
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  // Read dynamic routes for blog/guides
  let extraRoutes = [];
  try {
    const blogData = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'public/data/blog.json'), 'utf-8'));
    extraRoutes = blogData.map(post => `/blog/${post.id}`);
  } catch(e) {
    console.warn("Could not load blog data for prerendering");
  }

  return {
    plugins: [
      react(), 
      tailwindcss(),
      // Prerender only during build to avoid slowing down dev
      // NOTE: Disabled for Vercel deployment as Vercel build environment 
      // does not support Puppeteer by default.
      /*
      mode === 'production' && prerender({
        routes: [
          '/', '/discs', '/courses', '/gear', '/blog', '/disc-finder', '/analyzer', '/disc-return',
          ...extraRoutes
        ],
        renderer: new PuppeteerRenderer({
          // Wait for Helmet to inject tags before capturing HTML
          renderAfterTime: 2000,
        }),
        postProcess(renderedRoute) {
          // Keep the hydration marker for React 19
          renderedRoute.html = renderedRoute.html.replace(
            '<div id="root">',
            '<div id="root" data-server-rendered="true">'
          );
        }
      })
      */
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
