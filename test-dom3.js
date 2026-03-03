import puppeteer from 'puppeteer';

(async () => {
  try {
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

    await new Promise(r => setTimeout(r, 3000));
    
    // Test the new timeline DIV
    const res = await page.evaluate(() => {
       const timeline = document.querySelector('.group\\/slider > div.relative');
       if(!timeline) return "No timeline found";
       
       const rect = timeline.getBoundingClientRect();
       const x = rect.left + rect.width * 0.75;
       const evt = new MouseEvent('click', { bubbles: true, clientX: x, clientY: rect.top + rect.height / 2 });
       timeline.dispatchEvent(evt);
       return "Clicked at 75%";
    });
    
    console.log("Timeline action:", res);
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/0de6fc40-1cbb-4f66-a367-351157af7e02/check_timeline_final.webp' });
    await browser.close();
    console.log('Capture 3 OK');
  } catch(e) {
      console.log('Error', e.message);
  }
})();
