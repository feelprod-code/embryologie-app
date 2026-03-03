const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:5173');
  // Wait for loading
  await page.waitForTimeout(1000);
  
  // Click on "VIDÉOTEK" or navigate to VideoLibrary
  await page.locator('text=VIDÉOTEK').click();
  await page.waitForTimeout(1000);

  // Click on the first video to go to VideoPlayerPage
  await page.locator('h3').first().click();
  await page.waitForTimeout(1000);

  // Take a screenshot
  await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/44552baa-7043-4019-93f9-4274b6fc50d9/video_player_new_ui.png' });
  
  await browser.close();
})();
