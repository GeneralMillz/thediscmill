/**
 * Generate Amazon Affiliate Links
 * 
 * Usage:
 * node scripts/generate-affiliate-links.js "Disc Golf Retriever"
 * node scripts/generate-affiliate-links.js "Zuca Cart" "Innova Safari Basket"
 * 
 * Output:
 * Prints ready-to-use Amazon Affiliate search links for use in markdown files.
 */

const AMZN_AFFILIATE_TAG = 'thediscmill-20'; // Replace with actual tag

function generateLink(productName) {
  const query = encodeURIComponent(productName);
  return `[${productName}](https://www.amazon.com/s?k=${query}&tag=${AMZN_AFFILIATE_TAG})`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node generate-affiliate-links.js "Product 1" "Product 2"');
  process.exit(1);
}

console.log('\n🔗 Generated Amazon Affiliate Links:\n');

args.forEach(product => {
  console.log(`Product: ${product}`);
  console.log(`Markdown: ${generateLink(product)}\n`);
});
