import { Locator, Page, expect } from '@playwright/test';

export interface PurchaseOrderItem {
  productSearch: string;
  quantity?: number | string;
  unitPrice?: number | string;
  taxPercent?: number | string;
  discountPercent?: number | string;
}

export interface PurchaseOrderData {
  vendorName?: string;
  warehouseName?: string;
  orderDate?: string;
  items: PurchaseOrderItem[];
  notes?: string;
  markAsReceived?: boolean;
  paymentMethod?: 'Cash' | 'Online' | 'Card' | 'Bank Transfer' | 'Mixed' | string;
}

export class PurchaseOrderPage {
  readonly page: Page;

  // Header Navigation & Actions
  // "PO History" button is an orange button in the Order Summary panel
  readonly poHistoryButton: Locator;
  readonly goBackButton: Locator;

  // Form Fields - Header Information
  // Both vendor and warehouse are custom button dropdowns with class "nice-select-trigger"
  readonly vendorDropdownTrigger: Locator;
  readonly warehouseDropdownTrigger: Locator;
  // Order Date custom picker trigger (shows date text, class "dt-trigger")
  readonly orderDateInput: Locator;
  // Reference/Invoice number input
  readonly referenceNoInput: Locator;

  // Product Selection & Items Table
  // Search input placeholder: "Search by product name or SKU..."
  readonly productSearchInput: Locator;
  // Product results dropdown: buttons with class "Purchasing_ps-item__DLNDp"
  readonly productDropdownOptions: Locator;
  readonly itemsTable: Locator;
  readonly itemRows: Locator;
  readonly emptyItemsPlaceholder: Locator;

  // Additional Fields & Flags (right panel)
  // Notes textarea placeholder: "Instructions, remarks..."
  readonly notesTextarea: Locator;
  // Mark as Received - custom div toggle (NOT a native checkbox)
  // It's a div with cursor:pointer containing a ✓ styled box
  readonly markAsReceivedCheckbox: Locator;
  readonly markAsReceivedLabel: Locator;

  // Summary & Calculation Elements (right panel)
  readonly subtotalAmount: Locator;
  readonly grandTotalAmount: Locator;

  // Form Action Buttons (right panel)
  // "Clear All" button
  readonly clearFormButton: Locator;
  // "Save as Draft" button
  readonly saveDraftButton: Locator;
  // "Complete Order" button
  readonly completeOrderButton: Locator;

  // Confirm Purchase / Payment Modal
  readonly paymentModal: Locator;
  readonly cashPaymentButton: Locator;
  readonly onlinePaymentButton: Locator;
  readonly confirmPurchaseButton: Locator;
  readonly cancelPaymentButton: Locator;

  // Drafts Drawer / Modal
  readonly draftsButton: Locator;
  readonly draftsDrawer: Locator;
  readonly draftItems: Locator;
  readonly closeDraftsButton: Locator;

  // PO History Page Elements
  readonly searchPoInput: Locator;
  readonly statusFilterTrigger: Locator;
  readonly vendorFilterTrigger: Locator;
  readonly warehouseFilterTrigger: Locator;
  readonly historyTable: Locator;
  readonly historyRows: Locator;

  // PO Details Modal
  readonly poDetailsModal: Locator;
  readonly closeDetailsButton: Locator;

  // Void Confirmation Dialog
  readonly voidConfirmDialog: Locator;
  readonly confirmVoidButton: Locator;
  readonly cancelVoidButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // PO History Button - orange button in Order Summary panel
    this.poHistoryButton = page.getByRole('button', { name: /PO History/i }).first();
    this.goBackButton = page.getByRole('button', { name: /Go Back|Back/i }).first();

    // Vendor/Warehouse custom dropdowns - both use class "nice-select-trigger"
    this.vendorDropdownTrigger = page.locator('button.nice-select-trigger').first();
    this.warehouseDropdownTrigger = page.locator('button.nice-select-trigger').nth(1);

    // Order Date - the custom date picker shows date text like "Aug 10, 2026"
    this.orderDateInput = page.locator('.dt-trigger').first();
    // Reference/Invoice number input
    this.referenceNoInput = page.locator('input[placeholder*="INV-"]').first();

    // Product search - exact placeholder from UI inspection
    this.productSearchInput = page.locator('input[placeholder*="product name or SKU"]').first();
    // Product dropdown items appear with class "Purchasing_ps-item__DLNDp" as buttons
    this.productDropdownOptions = page.locator('[class*="ps-item"]');
    this.itemsTable = page.locator('table').first();
    this.itemRows = page.locator('table tbody tr');
    this.emptyItemsPlaceholder = page.locator('text=Your order is empty').first();

    // Notes & Remarks textarea - placeholder "Instructions, remarks..."
    this.notesTextarea = page.locator('textarea[placeholder*="Instructions"]').first();
    // Mark as Received - custom div toggle (not a native <input type=checkbox>)
    // It's a parent div with cursor:pointer containing an orange ✓ box + label span
    this.markAsReceivedCheckbox = page.locator('text=Mark as Received').locator('..');
    this.markAsReceivedLabel = page.locator('text=Mark as Received').first();

    // Calculations - right panel
    this.subtotalAmount = page.locator('text=Subtotal').locator('..').locator('span, div').last();
    this.grandTotalAmount = page.locator('text=Grand Total').locator('..').locator('span, div').last();

    // Action buttons - right panel
    this.clearFormButton = page.getByRole('button', { name: /Clear All/i }).first();
    this.saveDraftButton = page.getByRole('button', { name: /Save as Draft/i }).first();
    this.completeOrderButton = page.getByRole('button', { name: /Complete Order/i }).first();

    // Drafts button (appears in PO History view)
    this.draftsButton = page.getByRole('button', { name: /Draft/i }).first();

    // Payment Modal
    this.paymentModal = page.locator('div[role="dialog"]').filter({ hasText: 'Confirm' }).last();
    this.cashPaymentButton = page.getByRole('button', { name: /^Cash$/i }).first();
    this.onlinePaymentButton = page.getByRole('button', { name: /^Online$/i }).first();
    this.confirmPurchaseButton = page.getByRole('button', { name: /Confirm Purchase|Confirm/i }).last();
    this.cancelPaymentButton = page.getByRole('button', { name: /Cancel|Close/i }).first();

    // Drafts Drawer
    this.draftsDrawer = page.locator('div[role="dialog"]').filter({ hasText: 'Draft' }).first();
    this.draftItems = page.locator('div:has-text("PO-")');
    this.closeDraftsButton = page.getByRole('button', { name: /Close/i }).first();

    // PO History Elements
    this.searchPoInput = page.locator('input[placeholder*="Search"]').first();
    this.statusFilterTrigger = page.locator('button:has-text("Status"), button:has-text("All Status")').first();
    this.vendorFilterTrigger = page.locator('button:has-text("Vendor"), button:has-text("All Vendors")').first();
    this.warehouseFilterTrigger = page.locator('button:has-text("Warehouse"), button:has-text("All Warehouses")').first();
    this.historyTable = page.locator('table').first();
    this.historyRows = page.locator('table tbody tr');

    // PO Details & Void
    this.poDetailsModal = page.locator('div[role="dialog"]').filter({ hasText: 'PO-' }).first();
    this.closeDetailsButton = page.getByRole('button', { name: /Close|✕/i }).first();
    this.voidConfirmDialog = page.locator('div[role="dialog"]').filter({ hasText: 'Void' }).first();
    this.confirmVoidButton = page.getByRole('button', { name: /Confirm Void|Void PO|Yes, Void/i }).last();
    this.cancelVoidButton = page.getByRole('button', { name: /Cancel|No/i }).first();
  }

  /**
   * Navigates directly to the Purchase Orders module
   */
  async navigate() {
    await this.page.goto('/owner/purchase-orders');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);
  }

  /**
   * Selects a vendor by name from the vendor/supplier custom dropdown
   * The dropdown uses "nice-select-trigger" button class with a fixed overlay popup
   */
  async selectVendor(vendorName: string) {
    // Click the vendor "nice-select-trigger" button to open dropdown
    await this.vendorDropdownTrigger.click();
    await this.page.waitForTimeout(600);

    // The dropdown popup is a fixed positioned div with z-index:99999
    // Options appear as div/span items inside it
    const dropdownPopup = this.page.locator('[style*="z-index: 99999"], [style*="z-index:99999"]').last();
    await dropdownPopup.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});

    // Find and click the vendor option by exact or partial text
    const vendorOption = this.page.locator(`[style*="z-index"] div:has-text("${vendorName}"), [style*="z-index"] span:has-text("${vendorName}"), [style*="z-index"] li:has-text("${vendorName}")`).last();
    await vendorOption.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Selects a receiving warehouse by name from the warehouse custom dropdown
   */
  async selectWarehouse(warehouseName: string) {
    // Click the warehouse "nice-select-trigger" button (second one)
    await this.warehouseDropdownTrigger.click();
    await this.page.waitForTimeout(600);

    // The dropdown popup is a fixed positioned div
    const warehouseOption = this.page.locator(`[style*="z-index"] div:has-text("${warehouseName}"), [style*="z-index"] span:has-text("${warehouseName}"), [style*="z-index"] li:has-text("${warehouseName}")`).last();
    await warehouseOption.click();
    await this.page.waitForTimeout(400);
  }

  /**
   * Sets the Order Date - date is pre-filled, click Set Now if date picker opens
   */
  async setOrderDateNow() {
    // Date is pre-filled by the app; nothing needed
    await this.page.waitForTimeout(100);
  }

  /**
   * Searches and adds a product to the PO item list
   * Product search uses class "Purchasing_ps-dropdown__pdBFO" for the dropdown
   * and "Purchasing_ps-item__DLNDp" for each product button
   */
  async addProductItem(item: PurchaseOrderItem) {
    const searchInput = this.page.locator('input[placeholder*="product name or SKU"]').first();
    await searchInput.click();
    await searchInput.fill(item.productSearch);
    await this.page.waitForTimeout(800);

    // Product dropdown appears below search with class "Purchasing_ps-item__DLNDp"
    // Each result is a <button> element
    const productItems = this.page.locator('[class*="ps-item"]');
    const count = await productItems.count().catch(() => 0);

    if (count > 0) {
      // Click first matching result
      await productItems.first().click();
      await this.page.waitForTimeout(600);
    } else {
      // No results found - press Escape to close and skip
      await searchInput.press('Escape');
      await this.page.waitForTimeout(300);
      return;
    }

    // If custom quantity is provided, update the last item row quantity
    if (item.quantity !== undefined) {
      const lastRow = this.itemRows.last();
      const qtyInput = lastRow.locator('input[type="number"]').first();
      if (await qtyInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await qtyInput.click({ clickCount: 3 });
        await qtyInput.fill(item.quantity.toString());
        await qtyInput.press('Tab');
        await this.page.waitForTimeout(200);
      }
    }

    // If custom unit price is provided, update unit price
    if (item.unitPrice !== undefined) {
      const lastRow = this.itemRows.last();
      const priceInput = lastRow.locator('input[type="number"]').nth(1);
      if (await priceInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await priceInput.click({ clickCount: 3 });
        await priceInput.fill(item.unitPrice.toString());
        await priceInput.press('Tab');
        await this.page.waitForTimeout(200);
      }
    }

    // If custom tax rate % is provided, update tax input
    if (item.taxPercent !== undefined) {
      const lastRow = this.itemRows.last();
      const taxInput = lastRow.locator('input[type="number"]').nth(2);
      if (await taxInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await taxInput.click({ clickCount: 3 });
        await taxInput.fill(item.taxPercent.toString());
        await taxInput.press('Tab');
        await this.page.waitForTimeout(200);
      }
    }
    await this.page.waitForTimeout(300);
  }

  /**
   * Sets Notes & Remarks in the right panel textarea
   */
  async fillNotes(notes: string) {
    const textarea = this.page.locator('textarea[placeholder*="Instructions"]').first();
    if (await textarea.isVisible()) {
      await textarea.fill(notes);
    }
  }

  /**
   * Sets the "Mark as Received" custom toggle state
   * This is a custom div-based toggle, not a native checkbox
   */
  async setMarkAsReceived(checked: boolean) {
    // The toggle is a div containing an orange ✓ box when checked
    const toggleBox = this.page.locator('text=Mark as Received').locator('..').locator('div').first();
    if (await toggleBox.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Determine current state by background color (orange = checked)
      const bgColor = await toggleBox.evaluate(el => getComputedStyle(el).background || getComputedStyle(el).backgroundColor);
      const isCurrentlyChecked = bgColor.includes('255, 122') || bgColor.includes('ff7a');

      if (isCurrentlyChecked !== checked) {
        await toggleBox.click();
        await this.page.waitForTimeout(300);
      }
    }
  }

  /**
   * Saves current PO form as Draft
   */
  async saveAsDraft() {
    await this.saveDraftButton.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Submits PO and completes with selected payment method
   */
  async completeOrder(paymentMethod: string = 'Cash') {
    await this.completeOrderButton.click();
    await this.page.waitForTimeout(1000);

    // Wait for the payment/confirm modal to appear
    const modal = this.page.locator('div[role="dialog"]').last();
    try {
      await modal.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // Modal may not appear if form validation fails
      return;
    }

    // Select payment method in Confirm Purchase dialog
    const methodButton = this.page.getByRole('button', { name: new RegExp(`^${paymentMethod}$`, 'i') })
      .or(this.page.locator(`button:has-text("${paymentMethod}")`)).first();

    if (await methodButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await methodButton.click();
      await this.page.waitForTimeout(400);
    }

    // Confirm purchase
    const confirmBtn = this.page.getByRole('button', { name: /Confirm Purchase|Confirm/i }).last();
    if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmBtn.click();
      await this.page.waitForTimeout(2000);
    }
  }

  /**
   * Opens PO History view by clicking "PO History" button
   */
  async openPoHistory() {
    const historyBtn = this.page.getByRole('button', { name: /PO History/i }).first();
    await historyBtn.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Filters PO History by status using the status dropdown
   */
  async filterHistoryByStatus(status: string) {
    // Status filter in history view
    const statusBtn = this.page.locator(
      'button:has-text("Status"), button:has-text("All Status"), button:has-text("Received"), button:has-text("Voided")'
    ).first();

    if (await statusBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await statusBtn.click();
      await this.page.waitForTimeout(300);
      const option = this.page.locator(
        `[role="option"]:has-text("${status}"), li:has-text("${status}"), div:has-text("${status}")`
      ).last();
      await option.click();
      await this.page.waitForTimeout(600);
    }
  }

  /**
   * Searches PO in History by PO number
   */
  async searchPoHistory(poNumber: string) {
    if (await this.searchPoInput.isVisible()) {
      await this.searchPoInput.fill(poNumber);
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Voids the first matching purchase order in the history table
   */
  async voidPurchaseOrder(poNumber?: string) {
    let targetRow = this.historyRows.first();
    if (poNumber) {
      targetRow = this.historyRows.filter({ hasText: poNumber }).first();
    }

    const voidButton = targetRow.getByRole('button', { name: /Void/i }).first();
    if (await voidButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await voidButton.click();
      await this.page.waitForTimeout(400);

      const confirmBtn = this.page.getByRole('button', { name: /Confirm Void|Yes, Void|Void PO/i }).last();
      if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmBtn.click();
        await this.page.waitForTimeout(1500);
      }
    }
  }

  /**
   * Closes PO details modal
   */
  async closePoDetails() {
    const closeBtn = this.page.getByRole('button', { name: /Close|✕/i }).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await this.page.waitForTimeout(300);
    }
  }

  /**
   * Returns back to Create PO form from History
   */
  async returnToCreatePo() {
    if (await this.goBackButton.isVisible()) {
      await this.goBackButton.click();
      await this.page.waitForTimeout(600);
    }
  }
}
