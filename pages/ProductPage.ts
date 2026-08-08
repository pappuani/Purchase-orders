import { Locator, Page, expect } from '@playwright/test';

export interface ProductData {
  name: string;
  code?: string;
  description?: string;
  barcode?: string;
  category?: string;
  type?: 'Vegetarian' | 'Non-Vegetarian' | string;
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
  readonly cancelFormButton: Locator;

  // Category Modal Elements
  readonly newCategoryButton: Locator;
  readonly searchCategoryInput: Locator;
  readonly saveCategoryButton: Locator;
  readonly cancelCategoryButton: Locator;

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
    this.productNameInput = page.locator('input[placeholder*="Chicken Burger"]');
    this.productCodeInput = page.locator('input[placeholder*="CB001"]');
    this.productDescInput = page.locator('textarea[placeholder*="Describe product"]');
    this.barcodeInput = page.locator('input[placeholder*="1234567890"]');

    this.createProductButton = page.getByRole('button', { name: 'Create Product' });
    this.cancelFormButton = page.getByRole('button', { name: 'Cancel' });

    // Category Elements
    this.newCategoryButton = page.getByRole('button', { name: 'New Category' });
    this.searchCategoryInput = page.locator('input[placeholder*="Search categories"]');
    this.saveCategoryButton = page.getByRole('button', { name: 'Save' });
    this.cancelCategoryButton = page.getByRole('button', { name: 'Cancel' });
  }

  /**
   * Navigates directly to Product Management page
   */
  async navigate() {
    await this.page.goto('/owner/product-management');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Switches to Products tab
   */
  async switchToProductsTab() {
    await this.productsTab.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Switches to Categories tab
   */
  async switchToCategoriesTab() {
    await this.categoriesTab.click();
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
      const typeBtn = this.page.locator('button', { hasText: /Vegetarian|Non-Vegetarian/i }).first();
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
   * Creates a new Category
   */
  async createCategory(name: string, description?: string) {
    await this.switchToCategoriesTab();
    await this.newCategoryButton.click();
    await this.page.waitForTimeout(500);

    // Fill Category name (second text input on screen when modal opens)
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

  /**
   * Searches categories
   */
  async searchCategory(name: string) {
    await this.searchCategoryInput.fill('');
    await this.searchCategoryInput.fill(name);
    await this.page.waitForTimeout(1000);
  }
}
