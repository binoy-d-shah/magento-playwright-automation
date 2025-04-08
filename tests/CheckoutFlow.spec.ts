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
    let cartPage, checkoutPage, registrationPage, loginPage;

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

        await homePage.searchForProduct(productsTestData.product1.name);
        await productSearchPage.clickOnFirstProduct();

        await productPage.addToCart();
        await productPage.goToCart();

        await cartPage.applyDiscountCode(productsTestData.couponCode);
        await expect(cartPage.getDiscountSuccessMessage()).resolves.toContain(productsTestData.couponCodeSuccessMessage);

        await cartPage.proceedToCheckout();
        await checkoutPage.fillGuestShippingDetails(guestUserData, 'guest');
        await checkoutPage.selectShippingMethod();

        const subTotal = await checkoutPage.getSubtotal();
        const discount = await checkoutPage.getDiscountAmount();
        const shippingCost = await checkoutPage.getShippingAmount();
        const grandTotal = await checkoutPage.getGrandTotal();

        await expect(discount).toBe((productsTestData.product1.price * 20) / 100);
        await expect(grandTotal).toBe(subTotal + shippingCost - discount);

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

        await homePage.searchForProduct(productsTestData.product1.name);
        await productSearchPage.clickOnFirstProduct();

        await productPage.addToCart();

        await homePage.searchForProduct(productsTestData.product2.name);
        await productSearchPage.clickOnFirstProduct();

        await productPage.addToCart();

        await productPage.goToCart();

        await cartPage.updateQuantity(productsTestData.product1.quantity);
        await expect(cartPage.getTotalQuantity()).resolves.toBe(productsTestData.product1.quantity);

        await cartPage.applyDiscountCode(productsTestData.couponCode);
        await expect(cartPage.getDiscountSuccessMessage()).resolves.toContain(productsTestData.couponCodeSuccessMessage);

        await cartPage.proceedToCheckout();
        await checkoutPage.fillGuestShippingDetails(guestUserData, 'guest');
        await checkoutPage.selectShippingMethod();

        const subTotal = await checkoutPage.getSubtotal();
        const discount = await checkoutPage.getDiscountAmount();
        const shippingCost = await checkoutPage.getShippingAmount();
        const grandTotal = await checkoutPage.getGrandTotal();

        await expect(subTotal).toBe((productsTestData.product1.price * productsTestData.product1.quantity) + (productsTestData.product2.price * productsTestData.product2.quantity));
        await expect(grandTotal).toBe(subTotal + shippingCost - discount);

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

        homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);

        await homePage.searchForProduct(productsTestData.product1.name);
        await productSearchPage.clickOnFirstProduct();

        await productPage.addToCart();
        await productPage.goToCart();

        await cartPage.updateQuantity(productsTestData.product1.quantity);
        await expect(cartPage.getTotalQuantity()).resolves.toBe(productsTestData.product1.quantity);

        await cartPage.proceedToCheckout();
        await checkoutPage.fillGuestShippingDetails(guestUserData, '');
        await checkoutPage.selectShippingMethod();

        const subTotal = await checkoutPage.getSubtotal();
        const shippingCost = await checkoutPage.getShippingAmount();
        const grandTotal = await checkoutPage.getGrandTotal();

        await expect(subTotal).toBe(productsTestData.product1.price * productsTestData.product1.quantity);
        await expect(grandTotal).toBe(subTotal + shippingCost);

        await checkoutPage.placeOrder();

        await expect(checkoutPage.getOrderConfirmationMessage()).resolves.toContain(productsTestData.checkoutSuccessMessage);
    });
});