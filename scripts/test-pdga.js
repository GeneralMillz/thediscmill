import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://www.pdga.com/course-directory/all?page=0', { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Wait a sec for JS rendering
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const html = await page.content();
  console.log(html.substring(0, 1500));
  
  // Try to find any course elements
  const body = await page.evaluate(() => document.body.innerHTML.substring(0, 5000));
  console.log("BODY:", body);
  
  const courseLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/course-directory/course/"]')).map(a => a.outerHTML);
  });
  console.log("COURSE LINKS:", courseLinks.slice(0, 5));
  
  const lis = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('li')).map(r => r.innerHTML).slice(0, 2);
  });
  console.log("LI ITEMS:", lis.length);
  
  await browser.close();
}
main();
