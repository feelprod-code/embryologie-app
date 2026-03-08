import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Loading production app...");
  await page.goto('https://embryologie-app.vercel.app');
  await page.waitForTimeout(3000);
  
  const content = await page.content();
  if (content.includes("Forcer")) {
      console.log("SUCCESS: Button is on production.");
  } else {
      console.log("FAILURE: Button is NOT on production yet.");
  }
  
  await browser.close();
})();
