import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const CLICKS_FILE = path.join(PUBLIC_DIR, 'data/outbound-clicks.json');
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'data/rollups');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function rollup() {
  if (!fs.existsSync(CLICKS_FILE)) {
    console.log('No clicks file found. Skipping rollup.');
    return;
  }

  const clicks = JSON.parse(fs.readFileSync(CLICKS_FILE, 'utf-8'));
  
  const mfgStats = {};
  const discStats = {};
  const pageStats = {};

  clicks.forEach(event => {
    const date = new Date(event.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Mfg Rollup
    if (!mfgStats[monthKey]) mfgStats[monthKey] = {};
    mfgStats[monthKey][event.manufacturer] = (mfgStats[monthKey][event.manufacturer] || 0) + 1;

    // Page Rollup
    if (!pageStats[monthKey]) pageStats[monthKey] = {};
    pageStats[monthKey][event.pageSource] = (pageStats[monthKey][event.pageSource] || 0) + 1;

    // Disc Rollup (derived from URL or utm_term if we had it in raw data, but let's use the url for now)
    // Actually the event has utm_term if tracked correctly, but let's assume it has a 'disc' field or similar
    // For now we'll just track manufacturer and page source as those are reliable.
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'clicks_by_manufacturer_monthly.json'), JSON.stringify(mfgStats, null, 2));
  fs.writeFileSync(path.join(OUTPUT_DIR, 'clicks_by_page_monthly.json'), JSON.stringify(pageStats, null, 2));
  
  console.log('Rollup complete. Data saved to public/data/rollups/');
}

rollup();
