const { chromium, devices } = require('playwright');
const iPhone14 = devices['iPhone 14 Pro'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone14
  });
  const page = await context.newPage();
  
  console.log('Navigating to local site...');
  await page.goto('http://localhost:5178/embryo/');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/44552baa-7043-4019-93f9-4274b6fc50d9/iphone_menu_bug.png' });
  console.log('Screenshot saved: iphone_menu_bug.png');
  await browser.close();
})();
