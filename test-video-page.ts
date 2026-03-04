const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to app...');
  await page.goto('http://localhost:5173/embryo/');
  await page.waitForTimeout(2000);
  
  console.log('Switching to English...');
  const engBtn = await page.$('text=ENG');
  if (engBtn) await engBtn.click();
  else {
    const enText = await page.getByText('EN', { exact: true });
    if(await enText.count() > 0) await enText.first().click();
  }
  await page.waitForTimeout(1000);

  console.log('Opening Video Library...');
  const videosNav = await page.$('text=VIDEOS');
  if (videosNav) await videosNav.click();
  await page.waitForTimeout(1000);

  console.log('Navigating to first video player page...');
  // Find any play button for a video and click it
  const playButton = await page.$('button.flex.items-center:has-text("VID")'); 
  if (playButton) {
     await playButton.click();
  } else {
     // fallback click the first element that looks like a video card
     const vCards = await page.$$('.cursor-pointer');
     if(vCards.length > 2) {
       await vCards[2].click();
     }
  }
  
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/44552baa-7043-4019-93f9-4274b6fc50d9/video_page_debug_en.png' });
  console.log('Screenshot saved.');
  await browser.close();
})();
