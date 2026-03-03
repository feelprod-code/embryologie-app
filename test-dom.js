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
  
  const html = await page.evaluate(() => {
     const player = document.querySelector('div.absolute.inset-0.w-full.h-full.pointer-events-none.z-0');
     const controls = document.querySelector('.bottom-0.left-0.right-0.p-4');
     return {
         playerHover: player ? window.getComputedStyle(player).pointerEvents : null,
         playerZ: player ? window.getComputedStyle(player).zIndex : null,
         controlsHover: controls ? window.getComputedStyle(controls).pointerEvents : null,
         controlsZ: controls ? window.getComputedStyle(controls).zIndex : null,
     }
  });
  console.log("DOM Styles:", html);
  await browser.close();
})();
