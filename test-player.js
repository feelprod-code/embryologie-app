import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173/');
  
  // Wait to see if any errors pop up
  await new Promise(r => setTimeout(r, 2000));
  
  // Click the first video to load VideoPlayerPage
  await page.evaluate(() => {
    const vids = document.querySelectorAll('div.cursor-pointer'); // Assuming the course cards are clickable
    for (let v of vids) {
       if(v.innerText && v.innerText.includes("Embryologie")) {
           v.click(); break;
       }
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  
  // Try to click play
  await page.evaluate(() => {
    const playBtn = document.querySelector('svg.ml-2'); // Play icon
    if(playBtn) {
        let parent = playBtn.closest('div');
        if(parent) parent.click();
    }
  });

  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
