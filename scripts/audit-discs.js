import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DISCS_FILE = path.resolve(__dirname, '../public/data/discs_fallback.json');

function main() {
  if (!fs.existsSync(DISCS_FILE)) {
    console.error('discs_fallback.json not found!');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DISCS_FILE, 'utf-8'));
  console.log(`Auditing ${data.length} discs...`);

  let missingFlightNumbers = 0;
  let missingImages = 0;
  let missingPlastics = 0;
  let missingAmazon = 0;

  data.forEach((disc) => {
    if (!disc.flightNumbers || typeof disc.flightNumbers.speed !== 'number') {
      missingFlightNumbers++;
      console.log(`[Missing Flight Numbers] ${disc.name} (${disc.brand})`);
    }
    if (!disc.image) {
      missingImages++;
    }
    if (!disc.plastics || disc.plastics.length === 0) {
      missingPlastics++;
    }
    if (!disc.amazonQuery && !disc.asin && !disc.amazonShort) {
      missingAmazon++;
    }
  });

  console.log('--- AUDIT RESULTS ---');
  console.log(`Total Discs: ${data.length}`);
  console.log(`Missing Flight Numbers: ${missingFlightNumbers}`);
  console.log(`Missing Images: ${missingImages}`);
  console.log(`Missing Plastics: ${missingPlastics}`);
  console.log(`Missing Amazon Links/Queries: ${missingAmazon}`);
}

main();
