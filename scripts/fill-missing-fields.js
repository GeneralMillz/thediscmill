import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FILE = path.resolve(__dirname, '../public/data/discs_fallback.json');

function main() {
  const discs = JSON.parse(fs.readFileSync(FILE, 'utf-8'));

  discs.forEach(disc => {
    // Basic fill for missing fields
    if (!disc.plastics) disc.plastics = ['Stock'];
    if (!disc.image) disc.image = '/placeholder-disc.png'; // Will use a placeholder or empty string
    
    // Auto-generate amazonQuery if neither asin, amazonShort, or amazonQuery exist
    if (!disc.asin && !disc.amazonShort && !disc.amazonQuery) {
      disc.amazonQuery = `${disc.brand} ${disc.name} disc golf`;
    }
  });

  fs.writeFileSync(FILE, JSON.stringify(discs, null, 2), 'utf-8');
  console.log(`Filled missing fields for ${discs.length} discs.`);
}

main();
