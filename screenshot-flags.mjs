import { chromium, devices } from 'playwright';
const iPhone14 = devices['iPhone 14 Pro'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone14
  });
  const page = await context.newPage();
  const url = 'http://localhost:5178/';
  console.log(`Navigating to ${url}`);
  try {
    await page.goto(url);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/44552baa-7043-4019-93f9-4274b6fc50d9/new_flag_switcher_test.png' });
    console.log('Screenshot saved: new_flag_switcher_test.png');
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
})();
