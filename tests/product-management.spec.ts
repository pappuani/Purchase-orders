import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';

const EMAIL = 'anicafeqr@gmail.com';
const PASSWORD = '123456';

test.describe('Cafe QR POS - Product Management E2E Automation Suite', () => {
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

  test('1. Catalog View: should display tabs and initial product catalog table', async ({ page }) => {
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

  test('2. Product Search: should search products by keyword accurately', async ({ page }) => {
    const searchTerm = 'Pepsi';
    await productPage.searchProduct(searchTerm);

    const row = productPage.getProductRow(searchTerm);
    await expect(row.first()).toBeVisible();
    await expect(row.first()).toContainText(searchTerm);

    await page.screenshot({ path: 'test-results/product-search-result.png' });
  });

  test('3. Product Creation: should fill General & Pricing details and create standard finished product', async ({ page }) => {
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
        type: 'Non-Vegetarian',
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

  test('4. Category Management: should switch to Categories tab and create new category', async ({ page }) => {
    const uniqueCat = `Category_${Date.now().toString().slice(-4)}`;

    await test.step('Switch to Categories tab', async () => {
      await productPage.switchToCategoriesTab();
      await expect(productPage.newCategoryButton).toBeVisible();
    });

    await test.step('Create new category', async () => {
      await productPage.createCategory(uniqueCat, 'Automated category description for testing');
    });

    await test.step('Verify category in categories list', async () => {
      await productPage.searchCategory(uniqueCat);
      const row = page.locator('tbody tr').filter({ hasText: uniqueCat });
      await expect(row.first()).toBeVisible({ timeout: 10000 });
      await page.screenshot({ path: 'test-results/created-category-verified.png' });
    });
  });

  test('5. UOM Management: should switch to UOMs tab, create a new UOM, and verify in list', async ({ page }) => {
    const uniqueUom = `Kg_${Date.now().toString().slice(-4)}`;
    const symbol = 'kg';

    await test.step('Switch to UOMs tab', async () => {
      await productPage.switchToUomsTab();
      await expect(productPage.newUomButton).toBeVisible();
    });

    await test.step('Create new Unit of Measurement (UOM)', async () => {
      await productPage.createUOM(uniqueUom, symbol, '2');
    });

    await test.step('Verify UOM in list', async () => {
      await productPage.searchUOM(uniqueUom);
      const row = productPage.getUOMRow(uniqueUom);
      await expect(row.first()).toBeVisible({ timeout: 10000 });
      await expect(row.first()).toContainText(uniqueUom);
      await page.screenshot({ path: 'test-results/created-uom-verified.png' });
    });
  });

  test('6. Ingredient Product Creation: should create raw material ingredient product', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const ingredientName = `Raw Patty ${uniqueId}`;
    const ingredientCode = `ING${uniqueId}`;
    const costPrice = '45.00';

    await test.step('Create Raw Material / Ingredient item', async () => {
      await productPage.createIngredientProduct({
        name: ingredientName,
        code: ingredientCode,
        costPrice: costPrice,
        uom: 'pcs',
      });
    });

    await test.step('Verify ingredient item in catalog list', async () => {
      await productPage.searchProduct(ingredientName);
      const row = productPage.getProductRow(ingredientName);
      await expect(row.first()).toBeVisible({ timeout: 10000 });
      await expect(row.first()).toContainText(ingredientName);
      await page.screenshot({ path: 'test-results/created-ingredient-verified.png' });
    });
  });

  test('7. Recipe / BOM Mapping: should link raw ingredient item to finished product recipe', async ({ page }) => {
    const uniqueId = Date.now().toString().slice(-4);
    const burgerName = `Recipe Burger ${uniqueId}`;
    const ingredientName = `Cheese Slice ${uniqueId}`;

    await test.step('Create raw material ingredient first', async () => {
      await productPage.createIngredientProduct({
        name: ingredientName,
        code: `CS${uniqueId}`,
        costPrice: '15.00',
        uom: 'pcs',
      });
    });

    await test.step('Create parent composite product', async () => {
      await productPage.openNewProductModal();
      await productPage.fillGeneralDetails({
        name: burgerName,
        code: `RB${uniqueId}`,
        type: 'Non-Vegetarian',
      });
      await productPage.fillPricingDetails('199', '60');
      await productPage.submitCreateProduct();
    });

    await test.step('Link ingredient to parent product recipe (BOM)', async () => {
      await productPage.addIngredientToRecipe(burgerName, ingredientName, '2');
      await page.screenshot({ path: 'test-results/recipe-bom-linked.png' });
    });
  });

  test('8. Variants Creation: should switch to Variants tab and create a global variant group', async ({ page }) => {
    const uniqueGroup = `Size_${Date.now().toString().slice(-4)}`;
    const options = ['Regular', 'Medium', 'Large'];

    await test.step('Switch to Variants tab', async () => {
      await productPage.switchToVariantsTab();
      await expect(productPage.newVariantButton).toBeVisible();
    });

    await test.step('Create new Variant Group with options', async () => {
      await productPage.createVariantGroup(uniqueGroup, options);
    });

    await test.step('Verify variant group in list', async () => {
      await productPage.searchVariant(uniqueGroup);
      const row = productPage.getVariantRow(uniqueGroup);
      await expect(row.first()).toBeVisible({ timeout: 10000 });
      await expect(row.first()).toContainText(uniqueGroup);
      await page.screenshot({ path: 'test-results/created-variant-group-verified.png' });
    });
  });

  test('9. Status Toggle: should toggle product active/available status switch', async ({ page }) => {
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
