import { Locator, Page, expect } from '@playwright/test';

export interface ProductData {
  name: string;
  code?: string;
  description?: string;
  barcode?: string;
  category?: string;
  type?: 'Vegetarian' | 'Non-Vegetarian' | 'Raw Material' | 'Ingredient' | string;
  uom?: string;
  salesPrice?: string;
  costPrice?: string;
  taxRate?: string;
  hsnCode?: string;
}

export class ProductPage {
  readonly page: Page;

  // Tabs
  readonly productsTab: Locator;
  readonly categoriesTab: Locator;
  readonly uomsTab: Locator;
  readonly variantsTab: Locator;

  // Product List Actions & Filters
  readonly newProductButton: Locator;
  readonly searchInput: Locator;
  readonly statusFilterButton: Locator;
  readonly categoryFilterButton: Locator;
  readonly productTableRows: Locator;

  // Product Form Modal Elements
  readonly generalTabButton: Locator;
  readonly inventoryTabButton: Locator;
  readonly pricingTabButton: Locator;
  readonly variantsSectionButton: Locator;
  readonly upsellsTabButton: Locator;

  readonly productNameInput: Locator;
  readonly productCodeInput: Locator;
  readonly productDescInput: Locator;
  readonly barcodeInput: Locator;

  readonly createProductButton: Locator;
  readonly saveProductButton: Locator;
  readonly cancelFormButton: Locator;

  // Category Modal Elements
  readonly newCategoryButton: Locator;
  readonly searchCategoryInput: Locator;
  readonly saveCategoryButton: Locator;
  readonly cancelCategoryButton: Locator;

  // UOM Modal Elements
  readonly newUomButton: Locator;
  readonly searchUomInput: Locator;
  readonly uomNameInput: Locator;
  readonly uomSymbolInput: Locator;
  readonly saveUomButton: Locator;
  readonly cancelUomButton: Locator;
  readonly uomTableRows: Locator;

  // Variants Elements
  readonly newVariantButton: Locator;
  readonly searchVariantInput: Locator;
  readonly variantNameInput: Locator;
  readonly variantValueInput: Locator;
  readonly addVariantValueButton: Locator;
  readonly saveVariantButton: Locator;
  readonly cancelVariantButton: Locator;
  readonly variantTableRows: Locator;

  // Recipe / BOM Elements
  readonly addIngredientButton: Locator;
  readonly ingredientSelectInput: Locator;
  readonly ingredientQtyInput: Locator;
  readonly saveRecipeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tabs
    this.productsTab = page.getByRole('button', { name: 'Products', exact: true });
    this.categoriesTab = page.getByRole('button', { name: 'Categories', exact: true });
    this.uomsTab = page.getByRole('button', { name: 'UOMs', exact: true });
    this.variantsTab = page.getByRole('button', { name: 'Variants', exact: true });

    // Header Actions / Filters
    this.newProductButton = page.getByRole('button', { name: 'New Product' });
    this.searchInput = page.locator('input[placeholder*="Search products"]');
    this.statusFilterButton = page.getByRole('button', { name: /Active/i }).first();
    this.categoryFilterButton = page.getByRole('button', { name: /All Categories/i }).first();
    this.productTableRows = page.locator('tbody tr');

    // Product Modal Tabs
    this.generalTabButton = page.getByRole('button', { name: 'GENERAL' });
    this.inventoryTabButton = page.getByRole('button', { name: 'INVENTORY' });
    this.pricingTabButton = page.getByRole('button', { name: 'PRICING' });
    this.variantsSectionButton = page.getByRole('button', { name: 'VARIANTS' });
    this.upsellsTabButton = page.getByRole('button', { name: 'UPSELLS' });

    // Product Modal Inputs
    this.productNameInput = page.locator('input[placeholder*="Chicken Burger"], input[placeholder*="Product Name" i]').first();
    this.productCodeInput = page.locator('input[placeholder*="CB001"], input[placeholder*="Code" i]').first();
    this.productDescInput = page.locator('textarea[placeholder*="Describe product" i], textarea').first();
    this.barcodeInput = page.locator('input[placeholder*="1234567890"], input[placeholder*="Barcode" i]').first();

    this.createProductButton = page.getByRole('button', { name: 'Create Product' });
    this.saveProductButton = page.getByRole('button', { name: /Save|Update/i });
    this.cancelFormButton = page.getByRole('button', { name: 'Cancel' });

    // Category Elements
    this.newCategoryButton = page.getByRole('button', { name: 'New Category' });
    this.searchCategoryInput = page.locator('input[placeholder*="Search categories"]');
    this.saveCategoryButton = page.getByRole('button', { name: 'Save' });
    this.cancelCategoryButton = page.getByRole('button', { name: 'Cancel' });

    // UOM Elements
    this.newUomButton = page.getByRole('button', { name: /New UOM|Add UOM/i });
    this.searchUomInput = page.locator('input[placeholder*="Search UOM" i], input[placeholder*="Search" i]').first();
    this.uomNameInput = page.locator('input[placeholder*="e.g. Kilogram" i], input[placeholder*="Unit Name" i], div[role="dialog"] input').first();
    this.uomSymbolInput = page.locator('input[placeholder*="e.g. kg" i], input[placeholder*="Symbol" i], input[placeholder*="Short Name" i]').first();
    this.saveUomButton = page.getByRole('button', { name: /Save|Create/i });
    this.cancelUomButton = page.getByRole('button', { name: 'Cancel' });
    this.uomTableRows = page.locator('tbody tr');

    // Variants Elements
    this.newVariantButton = page.getByRole('button', { name: /New Variant|Add Variant/i });
    this.searchVariantInput = page.locator('input[placeholder*="Search variant" i], input[placeholder*="Search" i]').first();
    this.variantNameInput = page.locator('input[placeholder*="Size" i], input[placeholder*="Variant Name" i], div[role="dialog"] input').first();
    this.variantValueInput = page.locator('input[placeholder*="Small, Medium" i], input[placeholder*="Option" i], input[placeholder*="Value" i]').first();
    this.addVariantValueButton = page.getByRole('button', { name: /Add Option|Add Value|\+/i });
    this.saveVariantButton = page.getByRole('button', { name: /Save|Create/i });
    this.cancelVariantButton = page.getByRole('button', { name: 'Cancel' });
    this.variantTableRows = page.locator('tbody tr');

    // Recipe / BOM Elements
    this.addIngredientButton = page.getByRole('button', { name: /Add Ingredient|Add Recipe Item/i });
    this.ingredientSelectInput = page.locator('input[placeholder*="Select ingredient" i], select[name*="ingredient" i]').first();
    this.ingredientQtyInput = page.locator('input[placeholder*="Quantity" i], input[type="number"]').first();
    this.saveRecipeButton = page.getByRole('button', { name: /Save Recipe|Apply/i });
  }

  /**
   * Navigates directly to Product Management page
   */
  async navigate() {
    await this.page.goto('/owner/product-management');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Tab switchers
   */
  async switchToProductsTab() {
    await this.productsTab.click();
    await this.page.waitForTimeout(500);
  }

  async switchToCategoriesTab() {
    await this.categoriesTab.click();
    await this.page.waitForTimeout(500);
  }

  async switchToUomsTab() {
    await this.uomsTab.click();
    await this.page.waitForTimeout(500);
  }

  async switchToVariantsTab() {
    await this.variantsTab.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Opens the New Product creation drawer/modal
   */
  async openNewProductModal() {
    await this.newProductButton.click();
    await this.productNameInput.waitFor({ state: 'visible' });
  }

  /**
   * Fills in General product details
   */
  async fillGeneralDetails(data: ProductData) {
    await this.generalTabButton.click();
    
    if (data.name) {
      await this.productNameInput.fill(data.name);
    }
    if (data.code) {
      await this.productCodeInput.fill(data.code);
    }
    if (data.description) {
      await this.productDescInput.fill(data.description);
    }
    if (data.barcode) {
      await this.barcodeInput.fill(data.barcode);
    }
    if (data.type) {
      const typeBtn = this.page.locator('button', { hasText: /Vegetarian|Non-Vegetarian|Raw Material|Ingredient/i }).first();
      if (await typeBtn.isVisible()) {
        await typeBtn.click();
        const option = this.page.locator('li, div, [role="option"]', { hasText: data.type }).first();
        if (await option.isVisible()) {
          await option.click();
        }
      }
    }
  }

  /**
   * Fills in Pricing details
   */
  async fillPricingDetails(salesPrice: string, costPrice?: string, taxRate?: string, hsnCode?: string) {
    await this.pricingTabButton.click();
    await this.page.waitForTimeout(500);

    const numericInputs = this.page.locator('input[placeholder="0.00"]');
    if (salesPrice && await numericInputs.first().isVisible()) {
      await numericInputs.first().fill(salesPrice);
    }
    if (costPrice && (await numericInputs.count()) > 1) {
      await numericInputs.nth(1).fill(costPrice);
    }
    if (taxRate) {
      const taxInput = this.page.locator('input[placeholder="0"]');
      if (await taxInput.isVisible()) {
        await taxInput.fill(taxRate);
      }
    }
    if (hsnCode) {
      const hsnInput = this.page.locator('input[placeholder*="2106"]');
      if (await hsnInput.isVisible()) {
        await hsnInput.fill(hsnCode);
      }
    }
  }

  /**
   * Creates an ingredient/raw material product
   */
  async createIngredientProduct(data: { name: string; code: string; costPrice: string; uom?: string }) {
    await this.switchToProductsTab();
    await this.openNewProductModal();
    await this.fillGeneralDetails({
      name: data.name,
      code: data.code,
      description: 'Raw material ingredient item for BOM recipe tracking',
      type: 'Raw Material',
      uom: data.uom || 'kg',
    });
    // Set cost price (sales price 0 or cost price for raw materials)
    await this.fillPricingDetails('0', data.costPrice, '0', '2106');
    await this.submitCreateProduct();
  }

  /**
   * Submits the create product form
   */
  async submitCreateProduct() {
    await this.createProductButton.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Cancels/closes the product form modal
   */
  async cancelProductForm() {
    await this.cancelFormButton.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Searches for a product using search bar
   */
  async searchProduct(name: string) {
    await this.searchInput.fill('');
    await this.searchInput.fill(name);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Gets row locator for a specific product name
   */
  getProductRow(productName: string): Locator {
    return this.productTableRows.filter({ hasText: productName });
  }

  /**
   * Category Management
   */
  async createCategory(name: string, description?: string) {
    await this.switchToCategoriesTab();
    await this.newCategoryButton.click();
    await this.page.waitForTimeout(500);

    const nameInput = this.page.locator('div[role="dialog"] input, .modal input, input:not([placeholder*="Search"])').first();
    await nameInput.fill(name);

    if (description) {
      const descInput = this.page.locator('textarea').first();
      if (await descInput.isVisible()) {
        await descInput.fill(description);
      }
    }

    await this.saveCategoryButton.click();
    await this.page.waitForTimeout(2000);
  }

  async searchCategory(name: string) {
    await this.searchCategoryInput.fill('');
    await this.searchCategoryInput.fill(name);
    await this.page.waitForTimeout(1000);
  }

  /**
   * UOM Management
   */
  async createUOM(name: string, symbol: string, precision?: string) {
    await this.switchToUomsTab();
    await this.newUomButton.click();
    await this.page.waitForTimeout(500);

    const dialogInputs = this.page.locator('div[role="dialog"] input, .modal input');
    if (await dialogInputs.first().isVisible()) {
      await dialogInputs.first().fill(name);
    }
    if ((await dialogInputs.count()) > 1) {
      await dialogInputs.nth(1).fill(symbol);
    }
    if (precision && (await dialogInputs.count()) > 2) {
      await dialogInputs.nth(2).fill(precision);
    }

    await this.saveUomButton.click();
    await this.page.waitForTimeout(2000);
  }

  async searchUOM(name: string) {
    if (await this.searchUomInput.isVisible()) {
      await this.searchUomInput.fill('');
      await this.searchUomInput.fill(name);
      await this.page.waitForTimeout(1000);
    }
  }

  getUOMRow(name: string): Locator {
    return this.uomTableRows.filter({ hasText: name });
  }

  /**
   * Variants Management
   */
  async createVariantGroup(groupName: string, optionValues: string[]) {
    await this.switchToVariantsTab();
    await this.newVariantButton.click();
    await this.page.waitForTimeout(500);

    const dialogInputs = this.page.locator('div[role="dialog"] input, .modal input');
    if (await dialogInputs.first().isVisible()) {
      await dialogInputs.first().fill(groupName);
    }

    // Add option values (e.g., Small, Medium, Large)
    for (const val of optionValues) {
      const optInput = this.page.locator('input[placeholder*="Option" i], input[placeholder*="Value" i]').first();
      if (await optInput.isVisible()) {
        await optInput.fill(val);
        if (await this.addVariantValueButton.isVisible()) {
          await this.addVariantValueButton.click();
        }
      }
    }

    await this.saveVariantButton.click();
    await this.page.waitForTimeout(2000);
  }

  async searchVariant(name: string) {
    if (await this.searchVariantInput.isVisible()) {
      await this.searchVariantInput.fill('');
      await this.searchVariantInput.fill(name);
      await this.page.waitForTimeout(1000);
    }
  }

  getVariantRow(name: string): Locator {
    return this.variantTableRows.filter({ hasText: name });
  }

  /**
   * Recipe / BOM Mapping: Links ingredient items to finished product
   */
  async addIngredientToRecipe(productName: string, ingredientName: string, quantity: string) {
    await this.switchToProductsTab();
    await this.searchProduct(productName);
    const row = this.getProductRow(productName).first();
    await row.click();
    await this.page.waitForTimeout(500);

    // Switch to Inventory / Recipe tab
    await this.inventoryTabButton.click();
    await this.page.waitForTimeout(500);

    if (await this.addIngredientButton.isVisible()) {
      await this.addIngredientButton.click();
      if (await this.ingredientSelectInput.isVisible()) {
        await this.ingredientSelectInput.fill(ingredientName);
        const option = this.page.locator('li, div, [role="option"]', { hasText: ingredientName }).first();
        if (await option.isVisible()) {
          await option.click();
        }
      }
      if (await this.ingredientQtyInput.isVisible()) {
        await this.ingredientQtyInput.fill(quantity);
      }
      if (await this.saveRecipeButton.isVisible()) {
        await this.saveRecipeButton.click();
      }
    }

    if (await this.saveProductButton.isVisible()) {
      await this.saveProductButton.click();
    } else {
      await this.cancelProductForm();
    }
    await this.page.waitForTimeout(1500);
  }
}
