import { chromium } from '@playwright/test';
import * as crypto from 'crypto';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Add listeners
  page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));
  
  // We simulate a magic link with a bad token to see if it throws unhandled exceptions
  console.log("Loading page with hash...");
  await page.goto('http://localhost:5173/#access_token=notreal&expires_in=3600&refresh_token=notreal&token_type=bearer&type=magiclink');
  
  await page.waitForTimeout(5000);
  console.log("Checking body content...");
  
  const html = await page.content();
  if (html.includes('animate-spin')) console.log("Spinner is visible");
  if (html.includes('id="root"')) console.log("Root div exists");
  
  await browser.close();
})();
