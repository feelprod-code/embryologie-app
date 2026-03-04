const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/embryo/');
  
  // Wait for load
  await page.waitForTimeout(2000);
  
  // Switch to English
  const engBtn = await page.$('text=ENG');
  if (engBtn) {
    await engBtn.click();
    await page.waitForTimeout(1000);
  } else {
    // maybe a hamburger menu?
    const hamburger = await page.$('.lucide-menu');
    if (hamburger) await hamburger.click();
    await page.waitForTimeout(500);
    const enBtn = await page.$('text=ENGLISH');
    if(enBtn) await enBtn.click();
  }
  
  await page.waitForTimeout(1000);

  // Click on Timeline or Videos
  // Let's go to video library directly by evaluating react state if possible, or clicking the nav
  const videosNav = await page.$('text=VIDEOS');
  if (videosNav) await videosNav.click();
  await page.waitForTimeout(1000);
  
  // Click first video in library
  const playBtn = await page.$('.lucide-play');
  if (playBtn) await playBtn.click();
  
  await page.waitForTimeout(2000);

  await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/44552baa-7043-4019-93f9-4274b6fc50d9/video_page_en.png' });
  await browser.close();
})();
