# 🍽️ Cafe QR POS - Playwright E2E Automation Suite

A robust end-to-end (E2E) automated testing framework built with **Playwright** and **TypeScript** using the **Page Object Model (POM)** pattern to verify the critical path workflows of the Cafe QR Point of Sale (POS) and Management application.

---

## 🚀 Modules Automated

### 1. 📦 Product Management Module (`tests/product-management.spec.ts`)
- **Product Catalog View**: Verifies catalog table loading, headers, and tabs (`Products`, `Categories`, `UOMs`, `Variants`).
- **Product Creation Flow**: Automates opening the New Product drawer, entering general info (Name, Code, Description, Barcode, Type), configuring pricing details (Sales Price, Cost Price, Tax Rate, HSN Code), submitting the form, and verifying the new item in the catalog.
- **Real-Time Product Search**: Tests dynamic search functionality across menu items.
- **Category Management**: Switches to the Categories tab, creates a new category with descriptions, and validates it in the category list.
- **Product Availability Toggle**: Verifies toggling active/available status switch on catalog items.

### 2. 🛒 POS & Sales Checkout Module (`tests/pos-sales.spec.ts`)
- **Dine-in Order**: Add items to the cart, send them to the kitchen, and complete cash settlement on tables.
- **Takeaway Order**: Guest checkouts with cash payment processed through the kitchen.
- **Delivery Order**: End-to-end checkout with delivery address processing.
- **Self-Healing Table Lock Handling**: Automatically detects occupied tables, completes pending orders in the Kitchen Display System (KDS), and clears the table before test execution.

---

## 🛠️ Technology Stack & Architecture
- **Framework**: Playwright (v1.44+)
- **Language**: TypeScript
- **Design Pattern**: Page Object Model (POM)
  - [LoginPage.ts](file:///C:/Users/Adminz/.gemini/antigravity-ide/scratch/pos-playwright-automation/pages/LoginPage.ts)
  - [ProductPage.ts](file:///C:/Users/Adminz/.gemini/antigravity-ide/scratch/pos-playwright-automation/pages/ProductPage.ts)
  - [SalesPage.ts](file:///C:/Users/Adminz/.gemini/antigravity-ide/scratch/pos-playwright-automation/pages/SalesPage.ts)
- **Artifacts**: Automatic screenshots, video recordings, and trace logs on test execution.

---

## 💻 Running Tests in Visual Studio Code / Terminal

### 1. Open Project in VS Code
Open the folder `pos-playwright-automation` in VS Code.

### 2. Run Product Management Tests
```bash
npx playwright test tests/product-management.spec.ts
```

### 3. Run All Test Suites
```bash
npx playwright test
```

### 4. Interactive UI Mode (Visual Dashboard)
```bash
npx playwright test --ui
```

### 5. View Test Reports & Traces
```bash
npx playwright show-report
```

---

## 📬 Contact & Portfolio
Developed by **pappuani**
- **Email**: pappuani8@gmail.com
- **GitHub**: [pappuani](https://github.com/pappuani)
