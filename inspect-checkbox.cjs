// node inspect-checkbox.cjs
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://cafe-test-qr-frontend.vercel.app/login');
  await page.waitForLoadState('load');
  await page.locator('input[type="email"], input[placeholder*="email" i]').first().fill('anicafeqr@gmail.com');
  await page.locator('input[type="password"]').first().fill('123456');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForURL('**/owner/**', { timeout: 20000 });
  
  await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/purchase-orders');
  await page.waitForTimeout(2000);
  
  // Find the "Mark as Received" element
  const markReceivedEl = await page.evaluate(() => {
    // Search for any element with "Received" text
    const elements = document.querySelectorAll('*');
    const matches = [];
    for (const el of elements) {
      if (el.textContent.trim() === 'Mark as Received' || el.textContent.trim() === 'Received') {
        const parent = el.parentElement;
        matches.push({
          tag: el.tagName,
          cls: el.className,
          text: el.textContent.trim(),
          parentTag: parent ? parent.tagName : '',
          parentCls: parent ? parent.className : '',
          parentHTML: parent ? parent.outerHTML.substring(0, 500) : ''
        });
        if (matches.length >= 3) break;
      }
    }
    return matches;
  });
  console.log('Mark as Received elements:');
  console.log(JSON.stringify(markReceivedEl, null, 2));
  
  // Check for any checkbox-like elements
  const checkboxes = await page.evaluate(() => {
    const types = ['input[type="checkbox"]', '[role="checkbox"]', 'input[type="radio"]'];
    const results = {};
    for (const sel of types) {
      const els = document.querySelectorAll(sel);
      results[sel] = els.length;
    }
    return results;
  });
  console.log('Checkbox-like elements count:', checkboxes);
  
  await browser.close();
})();
