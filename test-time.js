import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
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
  
  await page.evaluate(() => {
    const playBtn = document.querySelector('svg.ml-2');
    if(playBtn) {
        let parent = playBtn.closest('div');
        if(parent) parent.click();
    }
  });

  await new Promise(r => setTimeout(r, 4000));
  
  // click timeline somewhere in middle
  await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="range"]');
      if(inputs.length > 0) {
          inputs[0].value = 0.5;
          const evt = new Event('change', { bubbles: true });
          inputs[0].dispatchEvent(evt);
          const evtUp = new MouseEvent('mouseup', { bubbles: true });
          inputs[0].dispatchEvent(evtUp);
      }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
