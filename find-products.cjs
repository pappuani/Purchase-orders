// Run from pos-playwright-automation directory: node find-products.cjs
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
  
  // Select vendor COM
  const vendorBtn = page.locator('button.nice-select-trigger').first();
  await vendorBtn.click();
  await page.waitForTimeout(800);
  
  // Click COM option
  const comOption = page.locator('[style*="z-index"]').filter({ hasText: 'COM' }).locator('div, span, li').filter({ hasText: /^COM$/ }).first();
  await comOption.click();
  await page.waitForTimeout(500);
  
  // Try searching with just "a" to see all products
  const searchInput = page.locator('input[placeholder*="product name or SKU"]').first();
  await searchInput.fill('a');
  await page.waitForTimeout(1000);
  
  // Screenshot
  await page.screenshot({ path: 'find-products.png' });
  
  // Get the product dropdown that appears
  const dropdownText = await page.evaluate(() => {
    // The dropdown appears below the search input
    const searchParent = document.querySelector('input[placeholder*="product name"]');
    if (!searchParent) return 'search input not found';
    
    let container = searchParent.parentElement;
    for (let i = 0; i < 5; i++) {
      const nextSib = container.nextElementSibling;
      if (nextSib) {
        return nextSib.outerHTML.substring(0, 2000);
      }
      container = container.parentElement;
    }
    return 'no dropdown found';
  });
  console.log('Product dropdown HTML:', dropdownText);
  
  await browser.close();
})();
