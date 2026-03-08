import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR]: ${err.message}`));
  page.on('requestfailed', request =>
    console.log(`[REQUEST FAILED] ${request.url()} - ${request.failure()?.errorText}`)
  );
  
  console.log("Navigating to http://localhost:5173/");
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(1000);

  // We are going to trigger the 'error' branch in playwright to see where it comes from
  console.log("Content check:");
  const content = await page.content();
  console.log("Root content present:", content.includes('id="root"'));
  console.log("Body length:", content.length);
  
  await browser.close();
})();
