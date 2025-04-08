# Magento E-commerce Automation (Playwright + TypeScript)

This project contains end-to-end automated tests for the [Magento Software Testing Board](https://magento.softwaretestingboard.com) website using **Playwright** and **TypeScript**. It covers core e-commerce functionalities such as product search, sorting, cart management, discount application, checkout (guest and logged-in), and order verification.

---

## Features Covered

- Product search using valid/invalid keywords
- Sorting by price and name (ascending/descending)
- Navigating to product detail pages
- Adding single/multiple products to cart
- Updating product quantity
- Applying discount coupon
- Checkout as:
  - Guest user (with discount, multiple products)
  - Logged-in user (with quantity update)
- Subtotal, discount, shipping, and grand total validation
- Order confirmation verification

---

## Setup Instructions

### Prerequisites

- Node.js >= 16
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/binoy-d-shah/magento-playwright-automation.git
cd magento-playwright-automation
```

### Install dependencies
```bash
npm install
```

This will install:
- Playwright for browser automation
- Faker.js for generating random data
- Other utilities like `@playwright/test`, `@types/node`, etc.

---

### Run Tests

You can run the Playwright tests using the following command:

- **Run All Tests**:

```bash
npx playwright test --workers=3
```

- **Run Specific Test**:

```bash
npx playwright test tests/checkoutFlow.spec.ts
```
- **Headed mode (UI)**:

```bash
npx playwright test --headed
```

- **Generate HTML report**:

```bash
npx playwright show-report
```

---

### Linting Setup

This project uses ESLint to ensure code quality and maintain coding standards.

- **Install ESLint dependencies:** Already covered in npm install.
- **Run ESLint:** You can run ESLint manually using the following command:

```bash
npx eslint . --ext .ts
```

- **Automatically Fix Linting Issues:** You can automatically fix linting issues on file save in VSCode by enabling the eslint.autoFixOnSave setting in VSCode settings.

---

### Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)