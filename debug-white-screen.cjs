const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log('Navigating to http://localhost:5178/embryo/');
  await page.goto('http://localhost:5178/embryo/');
  
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/44552baa-7043-4019-93f9-4274b6fc50d9/debug_white_screen.png' });
  await browser.close();
})();
