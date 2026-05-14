import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function main() {
  try {
    console.log('Committing new blog post data...');
    
    // Stage the blog json
    execSync('git add public/data/blog.json', { cwd: rootDir, stdio: 'inherit' });
    
    // Check if there are changes
    const status = execSync('git status --porcelain', { cwd: rootDir, encoding: 'utf-8' });
    if (!status.includes('public/data/blog.json')) {
      console.log('No new blog updates to commit.');
      return;
    }

    // Commit
    const dateStr = new Date().toISOString().split('T')[0];
    execSync(`git commit -m "content: ingest daily zo email ${dateStr}"`, { cwd: rootDir, stdio: 'inherit' });
    
    // Push
    console.log('Pushing to GitHub...');
    execSync('git push origin main', { cwd: rootDir, stdio: 'inherit' });
    
    console.log('✅ Successfully committed and pushed new blog content.');
  } catch (error) {
    console.error('❌ Error during auto-commit:', error.message);
  }
}

main();
