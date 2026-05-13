import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BLOG_DATA_PATH = path.resolve(__dirname, '../public/data/blog.json');

async function main() {
  const emailFile = process.argv[2];
  if (!emailFile) {
    console.error('Usage: node ingest-zo-email.js <path-to-email.txt>');
    process.exit(1);
  }

  const emailPath = path.resolve(process.cwd(), emailFile);
  if (!fs.existsSync(emailPath)) {
    console.error(`File not found: ${emailPath}`);
    process.exit(1);
  }

  const emailContent = fs.readFileSync(emailPath, 'utf-8');
  console.log(`Processing email from ${emailFile}...`);

  const prompt = \`
You are an expert SEO content editor and disc golf writer. 
I have a daily disc golf intelligence email ("Zo email") below.
Extract the information and format it as a highly SEO-optimized JSON object suitable for a blog post.
The JSON object must have these exact keys:
- id: A highly SEO-optimized, URL-friendly slug based on the primary topic (e.g., "innova-firebird-retool-mvp-drop-may-2026").
- title: A catchy, SEO-optimized title for the blog post (include keywords like "Disc Golf", brands, or disc names).
- excerpt: A compelling, keyword-rich meta description (max 160 characters).
- author: "DiscMill"
- category: A single string representing the most relevant SEO category (e.g., "Industry News", "New Releases", "Pro Tour").
- tags: An array of string tags representing the brands, players, and discs mentioned (e.g., ["Innova", "Paul McBeth", "Destroyer"]).
- content: The full email content formatted beautifully in Markdown.

CRITICAL INSTRUCTIONS:
1. INTERNAL LINKING: Whenever you mention a specific disc or manufacturer, you MUST hyper-link it using Markdown to our site's SEO URL structure.
   - For a disc: [Brand DiscName](/disc/brand-slug/disc-slug) -> Example: [Innova Destroyer](/disc/innova/destroyer)
   - For a manufacturer: [Brand Name](/manufacturer/brand-slug) -> Example: [Discmania](/manufacturer/discmania)
2. MARKDOWN FORMATTING: Use appropriate ## and ### headings, bulleted lists, and bold text to make it easy to read.
3. STRIP INTERNAL NOTES: The email often contains internal notes starting at "8. Content Ideas for DiscMill". You MUST IGNORE and STRIP OUT everything from section 8 onwards. The final content should only contain sections 1 through 7.

Email Content:
\${emailContent}

Return ONLY valid JSON. Do not wrap in markdown codeblocks like \\\`\\\`\\\`json.
\`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    let rawJson = response.text.trim();
    if (rawJson.startsWith('```json')) {
      rawJson = rawJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (rawJson.startsWith('```')) {
        rawJson = rawJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const postData = JSON.parse(rawJson);
    postData.date = Date.now();

    let existingPosts = [];
    if (fs.existsSync(BLOG_DATA_PATH)) {
      existingPosts = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf-8'));
    }

    // Check if ID exists, append timestamp if so
    if (existingPosts.some(p => p.id === postData.id)) {
        postData.id = `${postData.id}-${Date.now()}`;
    }

    existingPosts.unshift(postData);
    fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(existingPosts, null, 2));

    console.log(`Success! Appended new blog post: ${postData.title}`);
  } catch (error) {
    console.error('Error generating or parsing content:', error);
  }
}

main();
