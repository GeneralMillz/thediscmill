import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOG_FILE = path.resolve(__dirname, '../public/data/blog.json');

const data = JSON.parse(fs.readFileSync(BLOG_FILE, 'utf-8'));

function formatMarkdown(text) {
  // Replace "1. Daily Summary" with "## 1. Daily Summary\n\n"
  text = text.replace(/^(\d+\.\s+[A-Z].+?)$/gm, '\n## $1\n');
  
  // Replace single newlines with double newlines for paragraphs, but carefully
  // We'll split by lines and rebuild
  const lines = text.split('\n');
  let inTable = false;
  let formatted = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|')) {
      inTable = true;
      formatted.push(line);
      continue;
    } else if (inTable && !line.startsWith('|')) {
      inTable = false;
      formatted.push('\n'); // Add gap after table
    }
    
    if (!line) {
      formatted.push('');
      continue;
    }

    if (line.startsWith('##')) {
      formatted.push('');
      formatted.push(line);
      formatted.push('');
    } else if (line.startsWith('Source:')) {
      formatted.push('\n*' + line + '*\n');
    } else {
      // It's a paragraph or list item
      if (!line.startsWith('-') && !line.startsWith('##') && !inTable) {
        formatted.push('- ' + line); // Convert to bullet points to break up wall of text
      } else {
        formatted.push(line);
      }
    }
  }
  
  // Clean up multiple newlines
  return formatted.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

for (const post of data) {
  post.content = formatMarkdown(post.content);
}

fs.writeFileSync(BLOG_FILE, JSON.stringify(data, null, 2));
console.log('Formatted blog.json');
