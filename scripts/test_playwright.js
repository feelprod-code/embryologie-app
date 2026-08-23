import { chromium } from '@playwright/test';

async function test() {
    try {
        const browser = await chromium.launch();
        console.log("Playwright browser launched successfully!");
        await browser.close();
    } catch (e) {
        console.error("Playwright launch error:", e.message);
    }
}

test();
