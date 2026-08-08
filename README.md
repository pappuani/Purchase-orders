# 🍽️ Cafe QR POS - Product Management E2E Automation Suite

A robust end-to-end (E2E) automated testing framework built with **Playwright** and **TypeScript** using the **Page Object Model (POM)** pattern to verify the critical path workflows of the Cafe QR Point of Sale (POS) and Product Management application.

---

## 🚀 Automated Modules & Test Coverage

### 📦 Product Management Module (`tests/product-management.spec.ts`)
1. **Catalog View & Grid Validation**: Verifies catalog table loading, column headers, and tabs (`Products`, `Categories`, `UOMs`, `Variants`).
2. **Real-Time Product Search**: Tests dynamic search functionality across menu items.
3. **Standard Product Creation Flow**: Automates opening the New Product drawer, entering general info (Name, Code, Description, Barcode, Type), configuring pricing details (Sales Price, Cost Price, Tax Rate, HSN Code), submitting the form, and verifying in the catalog.
4. **Category Management**: Switches to Categories tab, creates a new category with descriptions, and validates it in the list.
5. **UOM (Unit of Measurement) Management**: Switches to UOMs tab, creates custom units (e.g., `Kilogram / kg`, `Piece / pcs`), and validates in table.
6. **Ingredient (Raw Material) Creation**: Automates creating raw ingredient products with linked UOM and cost prices for inventory tracking.
7. **Recipe / Bill of Materials (BOM) Mapping**: Automates linking raw ingredients with specified quantities to finished composite dishes (e.g., attaching Cheese & Patty to Burger).
8. **Variants Management**: Creates global variant groups (e.g., `Size: Regular, Medium, Large`) and validates them in the variant registry.
9. **Product Availability Toggle**: Verifies toggling active/available status switch on catalog items.

---

## 🛠️ Technology Stack & Architecture
- **Framework**: Playwright (v1.44+)
- **Language**: TypeScript
- **Design Pattern**: Page Object Model (POM)
  - `pages/LoginPage.ts` — Authentication & session handling
  - `pages/ProductPage.ts` — Product, Category, UOM, Variant, Ingredient & Recipe methods
- **Artifacts**: Automatic screenshots, video recordings, and trace logs on test execution.

---

## 💻 Running Tests in Visual Studio Code / Terminal

### 1. Open Project in VS Code
Open the folder `pos-playwright-automation` in VS Code or your terminal.

### 2. Run Product Management Suite
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

## 📬 Author
Developed by **pappuani**
- **Email**: pappuani8@gmail.com
- **GitHub**: [pappuani](https://github.com/pappuani)
