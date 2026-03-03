const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.message);
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  await page.goto('http://localhost:5173/embryo/');

  try {
    // attente chargement
    await page.waitForSelector('button', { timeout: 3000 });
    const buttons = await page.$$('button');
    console.log(`Found ${buttons.length} buttons on Home`);

    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes("Accéder à la formation")) {
        console.log("Clicking Accéder à la formation...");
        await btn.click();
        break;
      }
    }

    await page.waitForTimeout(2000);

    // Now we should be on VideoLibraryList
    const layerButtons = await page.$$('button');
    console.log(`Found ${layerButtons.length} buttons on new page`);
    for (const btn of layerButtons) {
      let text = await page.evaluate(el => el.textContent, btn);
      if (text && text.trim() === "Endoderme") {
        console.log("Clicking Endoderme...");
        await btn.click();
        await page.waitForTimeout(1000);
        console.log("Clicked Endoderme, waiting");
      } else if (text && text.trim() === "Mésoderme") {
        console.log("Clicking Mésoderme...");
        await btn.click();
        await page.waitForTimeout(1000);
      }
    }
    await page.screenshot({ path: 'test_screen.png' });
  } catch (e) {
    console.error(e);
  }

  await page.waitForTimeout(1000);
  await browser.close();
})();
