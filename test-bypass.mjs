import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set localStorage bypass flag
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    localStorage.setItem('DEV_BYPASS_AUTH', 'true');
  });
  
  // Reload page
  await page.reload({ waitUntil: 'networkidle0' });
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("Page contains 'Admin':", text.includes('Admin'));
  
  await browser.close();
})();
