import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5173/');
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const vids = document.querySelectorAll('div.cursor-pointer');
    for (let v of vids) {
       if(v.innerText && v.innerText.includes("Embryologie")) {
           v.click(); break;
       }
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  
  // click somewhere on the timeline
  await page.evaluate(() => {
     const timeline = document.querySelector('.group\\/slider > div.relative');
     if(timeline) {
         const rect = timeline.getBoundingClientRect();
         const evt = new MouseEvent('click', {
             bubbles: true,
             clientX: rect.left + rect.width / 2,
             clientY: rect.top + rect.height / 2
         });
         timeline.dispatchEvent(evt);
     }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/0de6fc40-1cbb-4f66-a367-351157af7e02/check_timeline.webp' });
  await browser.close();
  console.log('Capture 2 OK');
})();
