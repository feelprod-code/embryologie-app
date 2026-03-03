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
  
  await page.screenshot({ path: '/Users/philippeguillaume/.gemini/antigravity/brain/0de6fc40-1cbb-4f66-a367-351157af7e02/check_subtitles.webp' });
  await browser.close();
  console.log('Capture OK');
})();
