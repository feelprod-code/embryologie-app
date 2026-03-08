import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console events
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  console.log("Navigating to test url...");
  // Simulate the redirect from Supabase with a fake access token (this won't actually log us in, but it will trigger the supabase client parsing)
  // Actually, we can just navigate to the page to see if it renders.
  await page.goto('http://localhost:5173/');
  
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  if (content.includes("ACCÈS")) {
      console.log("Auth screen rendered properly.");
  } else {
      console.log("Auth screen NOT found.");
  }
  
  await browser.close();
})();
