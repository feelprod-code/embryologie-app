import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console events
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER FATAL ERROR:', error.message));
  
  console.log("Navigating to test url...");
  
  // Let's set a fake token in the hash as if we came from a magic link
  await page.goto('http://localhost:5173/#access_token=fake_token&expires_in=3600&refresh_token=fake_refresh&token_type=bearer&type=magiclink');
  
  await page.waitForTimeout(3000);
  
  const content = await page.content();
  if (content.includes("animate-spin")) {
      console.log("Stuck on loading spinner.");
  } else if (content.includes("ACCÈS") || content.includes("L'EMBRYOLOGIE")) {
      console.log("Rendered Auth Screen.");
  } else if (content.includes("root")) {
      console.log("Rendered something else. Length:", content.length);
      console.log(content.slice(0, 500));
  } else {
      console.log("Completely blank page.");
  }
  
  await browser.close();
})();
