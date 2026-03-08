import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to a mobile-like frame to show off the responsive design
  await page.setViewport({ width: 414, height: 896 });
  
  await page.goto('http://localhost:5173');
  
  // Ensure we are not logged in and not bypassed
  await page.evaluate(() => {
    localStorage.removeItem('DEV_BYPASS_AUTH');
    localStorage.removeItem('sb-eqcjgucfpmhvxkckokwb-auth-token');
  });
  
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForTimeout(1000);
  
  const screenshotPath = '/Users/philippeguillaume/.gemini/antigravity/brain/e0d9a4b7-6bc5-4a90-99cf-bbb0deab4550/auth_screen_brochure_style.png';
  await page.screenshot({ path: screenshotPath });
  
  await browser.close();
  console.log("Screenshot saved as " + screenshotPath);
})();
