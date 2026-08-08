import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';

const EMAIL = 'anicafeqr@gmail.com';
const PASSWORD = '123456';

test.describe('Cafe QR POS - Product Management E2E Automation', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000);
    loginPage = new LoginPage(page);
    productPage = new ProductPage(page);

    // Login to owner account
    await page.goto('/login');
    await page.waitForLoadState('load');
    await loginPage.login(EMAIL, PASSWORD);
    await page.waitForURL('**/owner/main-menu');

    // Navigate to Product Management page
    await productPage.navigate();
  });

  test('should display product management tabs and initial product catalog table', async ({ page }) => {
    await expect(productPage.productsTab).toBeVisible();
    await expect(productPage.categoriesTab).toBeVisible();
    await expect(productPage.uomsTab).toBeVisible();
    await expect(productPage.variantsTab).toBeVisible();
    await expect(productPage.newProductButton).toBeVisible();
    await expect(productPage.searchInput).toBeVisible();

    // Verify products table has loaded rows
    const count = await productPage.productTableRows.count();
    expect(count).toBeGreaterThan(0);

    await page.screenshot({ path: 'test-results/product-catalog-table.png' });
  });

  test('should search products by keyword accurately', async ({ page }) => {
    const searchTerm = 'Pepsi';
    await productPage.searchProduct(searchTerm);

    const row = productPage.getProductRow(searchTerm);
    await expect(row.first()).toBeVisible();
    await expect(row.first()).toContainText(searchTerm);

    await page.screenshot({ path: 'test-results/product-search-result.png' });
  });

  test('should open New Product drawer, fill General & Pricing details, and create product', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const testProductName = `Auto Burger ${uniqueId}`;
    const testProductCode = `AB${uniqueId}`;
    const testPrice = '149';

    await test.step('Open New Product form drawer', async () => {
      await productPage.openNewProductModal();
      await expect(productPage.productNameInput).toBeVisible();
    });

    await test.step('Fill General information', async () => {
      await productPage.fillGeneralDetails({
        name: testProductName,
        code: testProductCode,
        description: 'Automated test product generated via Playwright suite',
        barcode: `890${uniqueId}001`,
      });
    });

    await test.step('Fill Pricing information', async () => {
      await productPage.fillPricingDetails(testPrice, '80', '5', '2106');
    });

    await test.step('Submit product creation', async () => {
      await productPage.submitCreateProduct();
    });

    await test.step('Verify newly created product in catalog list', async () => {
      await productPage.searchProduct(testProductName);
      const productRow = productPage.getProductRow(testProductName);
      await expect(productRow.first()).toBeVisible({ timeout: 10000 });
      await expect(productRow.first()).toContainText(testProductName);
      await expect(productRow.first()).toContainText(testPrice);
      await page.screenshot({ path: 'test-results/created-product-verified.png' });
    });
  });

  test('should switch to Categories tab, open New Category modal, and create category', async ({ page }) => {
    const uniqueCat = `Category_${Date.now().toString().slice(-4)}`;

    await test.step('Switch to Categories tab', async () => {
      await productPage.switchToCategoriesTab();
      await expect(productPage.newCategoryButton).toBeVisible();
    });

    await test.step('Create new category', async () => {
      await productPage.createCategory(uniqueCat, 'Automated category description');
    });

    await test.step('Verify category in categories list', async () => {
      await productPage.searchCategory(uniqueCat);
      const row = page.locator('tbody tr').filter({ hasText: uniqueCat });
      await expect(row.first()).toBeVisible({ timeout: 10000 });
      await page.screenshot({ path: 'test-results/created-category-verified.png' });
    });
  });

  test('should toggle product active/available status switch', async ({ page }) => {
    await productPage.searchProduct('Pepsi');
    const row = productPage.getProductRow('Pepsi').first();
    await expect(row).toBeVisible();

    const toggle = row.locator('input[type="checkbox"]');
    if (await toggle.isVisible()) {
      const initialState = await toggle.isChecked();
      await toggle.click({ force: true });
      await page.waitForTimeout(1000);
      
      // Revert back to original state to preserve data consistency
      await toggle.click({ force: true });
      await page.waitForTimeout(1000);
      expect(await toggle.isChecked()).toBe(initialState);
    }
  });
});
