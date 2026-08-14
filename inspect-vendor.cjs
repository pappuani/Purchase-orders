// Run from pos-playwright-automation directory: node inspect-vendor.cjs
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://cafe-test-qr-frontend.vercel.app/login');
  await page.waitForLoadState('load');
  
  const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
  await emailInput.fill('anicafeqr@gmail.com');
  const passInput = page.locator('input[type="password"]').first();
  await passInput.fill('123456');
  const submitBtn = page.locator('button[type="submit"]').first();
  await submitBtn.click();
  await page.waitForURL('**/owner/**', { timeout: 20000 });
  
  await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/purchase-orders');
  await page.waitForTimeout(2000);
  
  // Click vendor dropdown
  const vendorBtn = page.locator('button.nice-select-trigger').first();
  await vendorBtn.click();
  await page.waitForTimeout(1000); // wait for animation
  
  // Get ALL new elements that appear after click
  const allText = await page.evaluate(() => {
    // Check body innerHTML for any dropdowns/lists
    const lists = document.querySelectorAll('ul, [role="listbox"], [class*="list"], [class*="dropdown"], [class*="option"]');
    const results = [];
    for (const el of lists) {
      const text = el.textContent.trim().substring(0, 200);
      const cls = el.className;
      const isVisible = el.getBoundingClientRect().height > 0;
      if (isVisible && text.length > 0) {
        results.push({ tag: el.tagName, cls, text, height: el.getBoundingClientRect().height });
      }
    }
    return results;
  });
  console.log('Visible lists/dropdowns after click:');
  console.log(JSON.stringify(allText, null, 2));
  
  // Screenshot after click
  await page.screenshot({ path: 'vendor-dropdown-open.png' });
  console.log('Screenshot saved to vendor-dropdown-open.png');
  
  // Try to find options
  const options = await page.evaluate(() => {
    const portal = document.getElementById('portal-root') || document.querySelector('[id*="portal"]');
    if (portal) return { portal: portal.outerHTML.substring(0, 2000) };
    
    // Look for any newly appearing elements
    const fixed = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"], [style*="z-index"]');
    return Array.from(fixed).slice(0, 5).map(el => ({
      tag: el.tagName, 
      cls: el.className,
      style: (el.getAttribute('style') || '').substring(0, 100),
      text: el.textContent.trim().substring(0, 200)
    }));
  });
  console.log('Fixed/portal elements:');
  console.log(JSON.stringify(options, null, 2));
  
  await browser.close();
})();
