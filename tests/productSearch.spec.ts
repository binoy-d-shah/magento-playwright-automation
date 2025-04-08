import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { ProductSearchPage } from '../pages/ProductSearchPage';
import { searchTestData } from '../utils/searchTestData';

/**
 * @testSuite Product Search Tests
 * @description Covers test scenarios related to product search, sorting, and detail view functionalities on the Magento demo site.
 */
test.describe('Product Search Tests', () => {
    let homePage, productSearchPage, productPage;

    /**
     * @beforeEach Hook
     * @description Initializes page objects and navigates to the Home page before each test.
     */
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productSearchPage = new ProductSearchPage(page);
        productPage = new ProductPage(page);

        // Navigate to Home Page
        await homePage.navigate();
    });

    /**
     * @test TC-01 Search for a product using valid keywords
     * @description Verify that the user can search for products using valid keywords.
     */
    test('Search for a product using valid keywords', async () => {
        // Search for vlaid product
        await homePage.searchForProduct(searchTestData.validKeyword);
        await expect(productSearchPage.hasResults()).resolves.toBeTruthy();
    });

    /**
     * @test TC-02 Search for a non-existent product
     * @description Verify that the system handles searches for non-existent products gracefully.
     */
    test('Search for a non-existent product', async () => {
        // Search for non-existent product
        await homePage.searchForProduct(searchTestData.invalidKeyword);
        await expect(productSearchPage.getNoResultsMessage()).resolves.toContain(searchTestData.noResultMessage);
    });

    /**
     * @test TC-03 Sort products by price (Low to High)
     * @description Verify sorting functionality by price (Low to High).
     */
    test('Sort products by price (Low to High)', async () => {
        
        // Search for product
        await homePage.searchForProduct(searchTestData.validKeyword);
        // Sort the product by price in ascending order
        await productSearchPage.sortBy('Price', 'asc');
        const prices = await productSearchPage.getProductPrices();
        await expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    /**
     * @test TC-04 Sort products by price (High to Low)
     * @description Verify sorting functionality by price (High to Low).
     */
    test('Sort products by price (High to Low)', async () => {
        
        // Search for product
        await homePage.searchForProduct(searchTestData.validKeyword);
        // Sort the product by price in descending order
        await productSearchPage.sortBy('Price', '');
        const prices = await productSearchPage.getProductPrices();
        await expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });

    /**
     * @test TC-05 Sort products by Product Name (A to Z)
     * @description Verify sorting functionality by product name from A to Z.
     */
    test('Sort products by Product Name (A to Z)', async () => {
        // Search the product
        await homePage.searchForProduct(searchTestData.validKeyword);
        // Sort the product by Product Name in ascending order
        await productSearchPage.sortBy('Name', 'asc');
        const names = await productSearchPage.getProductNames();
        await expect(names).toEqual([...names].sort());
    });

    /**
     * @test TC-06 Sort products by Product Name (Z to A)
     * @description Verify sorting functionality by product name from Z to A.
     */
    test('Sort products by Product Name (Z to A)', async () => {
        // Search for product
        await homePage.searchForProduct(searchTestData.validKeyword);
        // Sort the product by price in descending order
        await productSearchPage.sortBy('Name', '');
        const names = await productSearchPage.getProductNames();
        await expect(names).toEqual([...names].sort().reverse());
    });

    /**
     * @test TC-07 Navigate to product details page
     * @description Verify that the user can navigate to the product details page from search results.
     */
    test('Navigate to product details page', async () => {
        // Search for product
        await homePage.searchForProduct(searchTestData.validProduct);
        // Open first product and verify
        await productSearchPage.clickOnFirstProduct();
        await expect(productPage.getProductTitle()).resolves.toContain(searchTestData.validProduct);
    });

    /**
     * @afterEach Hook
     * @description Closes the page after each test.
     */
    test.afterEach(async ({ page }) => {
        await page.close();
    });
});