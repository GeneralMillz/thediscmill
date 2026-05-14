import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DATA_PATH = path.resolve(__dirname, '../public/data/blog.json');
const SEO_SAMPLES_PATH = path.resolve(__dirname, '../docs/seo-samples/seo-metadata.json');

const POSTS = [
  { slug: "best-disc-golf-starter-sets", template: "beginner-kit-template.md" },
  { slug: "disc-golf-bag-upgrade-guide", template: "bag-upgrade-template.md" },
  { slug: "best-disc-golf-rangefinders", template: "electronics-stack-template.md" },
  { slug: "waterproof-disc-golf-shoes", template: "waterproof-shoes-template.md" },
  { slug: "disc-golf-practice-nets", template: "practice-nets-template.md" },
  { slug: "best-gifts-for-disc-golfers", template: "gifts-template.md" },
  { slug: "glow-disc-golf-setup", template: "glow-setup-template.md" },
  { slug: "disc-golf-carts-vs-backpacks", template: "carts-template.md" },
  { slug: "disc-golf-tournament-checklist", template: "tournament-checklist-template.md" },
  { slug: "how-to-dye-disc-golf-discs", template: "dyeing-template.md" }
];

async function main() {
  const seoData = JSON.parse(fs.readFileSync(SEO_SAMPLES_PATH, 'utf-8'));
  let blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, 'utf-8'));

  let addedCount = 0;

  for (const post of POSTS) {
    const seoMeta = seoData.find(s => s.slug === post.slug);
    if (!seoMeta) {
      console.error(`Metadata not found for slug: ${post.slug}`);
      continue;
    }

    let content = '';
    if (post.template) {
      const templatePath = path.resolve(__dirname, `../docs/content-templates/${post.template}`);
      if (fs.existsSync(templatePath)) {
        content = fs.readFileSync(templatePath, 'utf-8');
      }
    }
    
    if (!content) {
      content = `## Content coming soon for ${seoMeta.title}`;
    }

    const newPost = {
      id: seoMeta.slug,
      title: seoMeta.title,
      excerpt: seoMeta.metaDescription,
      author: "DiscMill Gear Team",
      date: Date.now() - (addedCount * 1000 * 60 * 60 * 24), // Offset dates
      category: "Gear Guides",
      tags: seoMeta.tags,
      content: content
    };

    // Replace if exists
    const existingIndex = blogData.findIndex(p => p.id === newPost.id);
    if (existingIndex > -1) {
      blogData[existingIndex] = newPost;
    } else {
      blogData.push(newPost);
    }
    addedCount++;
  }

  fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blogData, null, 2));
  console.log(`Successfully generated and added ${addedCount} gear guides to blog.json!`);
}

main();
