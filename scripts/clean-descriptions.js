import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.resolve(__dirname, '../public/data/discs_fallback.json');
const discs = JSON.parse(fs.readFileSync(file, 'utf-8'));
let fixed = 0;

discs.forEach(d => {
  if (d.description && d.description.startsWith('"') && d.description.endsWith('"')) {
    d.description = d.description.substring(1, d.description.length - 1).trim();
    fixed++;
  }
});

fs.writeFileSync(file, JSON.stringify(discs, null, 2));
console.log(`Removed wrapping quotes from ${fixed} descriptions.`);
