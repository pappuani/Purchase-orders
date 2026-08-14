// Run from pos-playwright-automation directory: node inspect-product.cjs
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://cafe-test-qr-frontend.vercel.app/login');
  await page.waitForLoadState('load');
  
  const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
  await emailInput.fill('anicafeqr@gmail.com');
  await page.locator('input[type="password"]').first().fill('123456');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForURL('**/owner/**', { timeout: 20000 });
  
  await page.goto('https://cafe-test-qr-frontend.vercel.app/owner/purchase-orders');
  await page.waitForTimeout(2000);
  
  // Step 1: Click vendor dropdown and select COM
  const vendorBtn = page.locator('button.nice-select-trigger').first();
  await vendorBtn.click();
  await page.waitForTimeout(800);
  
  // Find and click "COM" option
  const comOption = page.locator('[style*="z-index"]').filter({ hasText: 'COM' }).locator('text=COM').first();
  await comOption.click();
  await page.waitForTimeout(500);
  
  // Get vendor dropdown HTML after selection
  const afterVendor = await page.locator('button.nice-select-trigger').first().textContent();
  console.log('Vendor dropdown text after selection:', afterVendor);
  
  // Step 2: Type in product search
  const searchInput = page.locator('input[placeholder*="product name or SKU"]').first();
  await searchInput.fill('coffee');
  await page.waitForTimeout(1000);
  
  // Screenshot product search
  await page.screenshot({ path: 'product-search.png' });
  console.log('Screenshot saved to product-search.png');
  
  // Get dropdown that appeared
  const productDropdownHTML = await page.evaluate(() => {
    const fixed = document.querySelectorAll('[style*="z-index"]');
    return Array.from(fixed).map(el => ({
      tag: el.tagName,
      cls: el.className,
      text: el.textContent.trim().substring(0, 300),
      style: (el.getAttribute('style') || '').substring(0, 150)
    }));
  });
  console.log('Fixed elements after product search:');
  console.log(JSON.stringify(productDropdownHTML, null, 2));
  
  // Try clicking first product result
  const firstResult = page.locator('[style*="z-index"] div, ul li, [class*="option"]').first();
  const isVisible = await firstResult.isVisible().catch(() => false);
  console.log('First product result visible:', isVisible);
  if (isVisible) {
    const text = await firstResult.textContent();
    console.log('First result text:', text?.substring(0, 100));
  }
  
  await browser.close();
})();
