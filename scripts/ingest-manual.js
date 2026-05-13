import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOG_FILE = path.resolve(__dirname, '../public/data/blog.json');

const email1Content = fs.readFileSync(path.resolve(__dirname, '../data/email1.txt'), 'utf-8');
const email2Content = fs.readFileSync(path.resolve(__dirname, '../data/email2.txt'), 'utf-8');
const email3Content = fs.readFileSync(path.resolve(__dirname, '../data/email3.txt'), 'utf-8');

function cleanContent(content) {
  const index = content.indexOf('8. Content Ideas for DiscMill');
  if (index !== -1) {
    return content.substring(0, index).trim();
  }
  return content.trim();
}

const posts = [
  {
    id: "daily-intelligence-may-13-2026",
    title: "Prodigy/Hasbro NERF Discs, MVP Massive Drop & More",
    excerpt: "Prodigy launches 4 NERF soft flight discs; MVP coordinates massive May 13 drop; Innova Lynx relaunches.",
    author: "DiscMill",
    date: new Date('2026-05-13T12:00:00Z').getTime(),
    category: "Daily Intelligence",
    content: cleanContent(email1Content)
  },
  {
    id: "daily-intelligence-may-12-2026",
    title: "Paul Ulibarri Wins at Austin, NERF Discs PDGA Approved",
    excerpt: "Paul Ulibarri takes the Barbasol Open at Austin. Innova announces FL mold, plus more MVP/Axiom updates.",
    author: "DiscMill",
    date: new Date('2026-05-12T12:00:00Z').getTime(),
    category: "Daily Intelligence",
    content: cleanContent(email2Content)
  },
  {
    id: "daily-intelligence-may-10-2026",
    title: "Westside Vellamo & DD4, Discmania Cloud Breaker Released",
    excerpt: "Westside Discs drops the new Vellamo midrange and DD4 distance driver. Simon Lizotte’s Neutron Balance hits stores.",
    author: "Zo",
    date: new Date('2026-05-10T12:00:00Z').getTime(),
    category: "Daily Intelligence",
    content: cleanContent(email3Content)
  }
];

// Overwrite completely to remove the previously appended versions
fs.writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2));
console.log("Successfully rebuilt blog.json with clean content.");
