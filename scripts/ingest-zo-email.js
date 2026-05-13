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

  const prompt = `
You are an expert content editor. 
I have a daily disc golf intelligence email ("Zo email") below.
Please extract the information and format it as a JSON object suitable for a blog post.
The JSON object must have these exact keys:
- id: A URL-friendly slug based on the title (e.g., "zo-brief-may-14").
- title: A catchy, appropriate title for the blog post.
- excerpt: A 1-2 sentence summary of the brief.
- author: "DiscMill"
- category: "Daily Intelligence"
- content: The full email content formatted nicely in Markdown.

CRITICAL INSTRUCTION: The email often contains internal notes starting at "8. Content Ideas for DiscMill". You MUST IGNORE and STRIP OUT everything from section 8 onwards. The final content should only contain sections 1 through 7.

Email Content:
${emailContent}

Return ONLY valid JSON. Do not wrap in markdown codeblocks like \`\`\`json.
`;

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
