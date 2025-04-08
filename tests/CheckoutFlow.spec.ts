import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductSearchPage } from '../pages/ProductSearchPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { productsTestData } from '../utils/productsTestData';
import { generateRandomGuestUser, generateRandomUser } from '../utils/dataProvider';

test.describe('Product Search Tests', () => {
    let homePage, productSearchPage, productPage;
    let cartPage, checkoutPage, registrationPage;

    const guestUserData = generateRandomGuestUser();
    const randomUser = generateRandomUser();

    /**
     * @beforeEach Hook
     * @description Initializes page objects and navigates to the Home page before each test.
     */
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productSearchPage = new ProductSearchPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        registrationPage = new RegistrationPage(page);

        // Navigate to Home Page
        await homePage.navigate();
    });

    /**
     * @test Checkout as Guest User with Discount Applied
     * @description 
     * - Search and add a products to cart.
     * - Apply a discount code.
     * - Proceed as guest and fill in shipping details.
     * - Validate subtotal, discount, shipping, and grand total.
     * - Place order and confirm success message.
     */
    test('Checkout flow as guest user', async () => {

        // Search for the product and click on very first product from search results
        await homePage.searchForProduct(productsTestData.product1.name);
        await productSearchPage.clickOnFirstProduct();

        // Add product to the cart and go to view cart
        await productPage.addToCart();
        await productPage.goToCart();

        // Apply discount and verify it
        await cartPage.applyDiscountCode(productsTestData.couponCode);
        await expect(cartPage.getDiscountSuccessMessage()).resolves.toContain(productsTestData.couponCodeSuccessMessage);

        // Proceed to checkout
        await cartPage.proceedToCheckout();

        // Enter shipping address and other details and select shipping method
        await checkoutPage.fillGuestShippingDetails(guestUserData, 'guest');
        await checkoutPage.selectShippingMethod();

        // Verify subtotal, grandtotal, discount and shipping cost
        const subTotal = await checkoutPage.getSubtotal();
        const discount = await checkoutPage.getDiscountAmount();
        const shippingCost = await checkoutPage.getShippingAmount();
        const grandTotal = await checkoutPage.getGrandTotal();

        await expect(discount).toBe((productsTestData.product1.price * 20) / 100);
        await expect(grandTotal).toBe(subTotal + shippingCost - discount);

        // Place the final order and verify the success message
        await checkoutPage.placeOrder();
        await expect(checkoutPage.getOrderConfirmationMessage()).resolves.toContain(productsTestData.checkoutSuccessMessage);
    });

    /**
     * @test Checkout as Guest User with Multiple Products and Discount Applied
     * @description 
     * - Search and add two different products to cart.
     * - Update quantity for the first product.
     * - Apply a discount code.
     * - Proceed as guest and fill in shipping details.
     * - Validate subtotal, discount, shipping, and grand total.
     * - Place order and confirm success message.
     */
    test('Checkout flow as guest user withh multiple products', async () => {

        // Search for the product and click on very first product from search results and add it to cart
        await homePage.searchForProduct(productsTestData.product1.name);
        await productSearchPage.clickOnFirstProduct();
        await productPage.addToCart();

        // Search for the product and click on very first product from search results and add it to cart
        await homePage.searchForProduct(productsTestData.product2.name);
        await productSearchPage.clickOnFirstProduct();
        await productPage.addToCart();

        // View cart
        await productPage.goToCart();

        // Update quantity and verify it
        await cartPage.updateQuantity(productsTestData.product1.quantity);
        await expect(cartPage.getTotalQuantity()).resolves.toBe(productsTestData.product1.quantity);

        // Apply discount and verify it
        await cartPage.applyDiscountCode(productsTestData.couponCode);
        await expect(cartPage.getDiscountSuccessMessage()).resolves.toContain(productsTestData.couponCodeSuccessMessage);

        // Proceed to checkout
        await cartPage.proceedToCheckout();

        // Enter shipping address and other details and select shipping method
        await checkoutPage.fillGuestShippingDetails(guestUserData, 'guest');
        await checkoutPage.selectShippingMethod();

        // Verify subtotal, grandtotal, discount and shipping cost
        const subTotal = await checkoutPage.getSubtotal();
        const discount = await checkoutPage.getDiscountAmount();
        const shippingCost = await checkoutPage.getShippingAmount();
        const grandTotal = await checkoutPage.getGrandTotal();

        await expect(subTotal).toBe((productsTestData.product1.price * productsTestData.product1.quantity) + (productsTestData.product2.price * productsTestData.product2.quantity));
        await expect(grandTotal).toBe(subTotal + shippingCost - discount);

        // Place the final order and verify the success message
        await checkoutPage.placeOrder();
        await expect(checkoutPage.getOrderConfirmationMessage()).resolves.toContain(productsTestData.checkoutSuccessMessage);
    });

    /**
     * @test Checkout as Logged-in User with Updated Quantity
     * @description 
     * - Register a new user dynamically.
     * - Search, add product to cart, and update quantity.
     * - Proceed to checkout with pre-filled user data.
     * - Validate calculated totals.
     * - Complete the purchase.
     */
    test('Checkout flow as logged-in user', async () => {

        // Register a new user and login
        homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);

        // Search for the product and click on very first product from search results and add it to cart
        await homePage.searchForProduct(productsTestData.product1.name);
        await productSearchPage.clickOnFirstProduct();
        await productPage.addToCart();

        // View cart
        await productPage.goToCart();

        // Update quantity and verify it
        await cartPage.updateQuantity(productsTestData.product1.quantity);
        await expect(cartPage.getTotalQuantity()).resolves.toBe(productsTestData.product1.quantity);

        // Proceed to checkout
        await cartPage.proceedToCheckout();
       
        // Enter shipping address and other details and select shipping method
        await checkoutPage.fillGuestShippingDetails(guestUserData, '');
        await checkoutPage.selectShippingMethod();

        // Verify subtotal, grandtotal, discount and shipping cost
        const subTotal = await checkoutPage.getSubtotal();
        const shippingCost = await checkoutPage.getShippingAmount();
        const grandTotal = await checkoutPage.getGrandTotal();

        await expect(subTotal).toBe(productsTestData.product1.price * productsTestData.product1.quantity);
        await expect(grandTotal).toBe(subTotal + shippingCost);

        // Place the final order and verify the success message
        await checkoutPage.placeOrder();
        await expect(checkoutPage.getOrderConfirmationMessage()).resolves.toContain(productsTestData.checkoutSuccessMessage);
    });
});