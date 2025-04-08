import { Locator, Page } from '@playwright/test';

export class CheckoutPage {

    private page: Page;
    private emailField: Locator;
    private firstNameField: Locator;
    private lastNameField: Locator;
    private addressField: Locator;
    private cityField: Locator;
    private stateField: Locator;
    private postCodeField: Locator;
    private phoneNumberField: Locator;
    private firstShippingMethod: Locator;
    private nextButton: Locator;
    private placeOrderButton: Locator;
    private checkoutSuccessMessage: Locator;
    private subTotalField: Locator;
    private discountField: Locator;
    private shippingField: Locator;
    private grandTotalField: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailField = page.locator('#customer-email').first();
        this.firstNameField = page.locator('input[name=firstname]');
        this.lastNameField = page.locator('input[name=lastname]');
        this.addressField = page.locator('//input[@name=\'street[0]\']');
        this.cityField = page.locator('input[name=city]');
        this.stateField = page.locator('select[name=region_id]');
        this.postCodeField = page.locator('input[name=postcode]');
        this.phoneNumberField = page.locator('input[name=telephone]');
        this.firstShippingMethod = page.locator('input[type=radio]').first();
        this.nextButton = page.locator('button.continue');
        this.placeOrderButton = page.locator('button.checkout');
        this.checkoutSuccessMessage = page.locator('.page-title-wrapper');
        this.subTotalField = page.locator('//span[@data-th=\'Cart Subtotal\']');
        this.discountField = page.locator('//span[@data-th=\'checkout.sidebar.summary.totals.discount\']');
        this.shippingField = page.locator('//span[@data-th=\'Shipping\']')
        this.grandTotalField = page.locator('//tr[@class=\'grand totals\']//span[@class=\'price\']');
    }

    async fillGuestShippingDetails(user, userType: string) {
        await this.page.waitForTimeout(3000);
        if (userType == 'guest')
            await this.emailField.fill(user.email);
        await this.firstNameField.fill(user.firstName);
        await this.lastNameField.fill(user.lastName);
        await this.addressField.fill(user.address);
        await this.cityField.fill(user.city);
        await this.stateField.selectOption(user.state);
        await this.postCodeField.fill(user.postcode);
        await this.phoneNumberField.fill(user.phoneNumber);
    }

    async confirmLoggedInShippingDetails() {
        await this.page.waitForSelector('input[name=firstname]');
    }

    async selectShippingMethod() {
        await this.firstShippingMethod.click();
        await this.nextButton.click();
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }

    async getOrderConfirmationMessage() {
        await this.page.waitForTimeout(3000);
        return this.checkoutSuccessMessage.textContent();
    }

    async getSubtotal(): Promise<number> {
        const subTotal = await this.subTotalField.textContent();
        return this.parsePrice(subTotal);
    }

    async getDiscountAmount(): Promise<number> {
        const discount = await this.discountField.textContent();
        return this.parsePrice(discount);
    }

    async getShippingAmount(): Promise<number> {
        const shippingCost = await this.shippingField.textContent();
        return this.parsePrice(shippingCost);
    }

    async getGrandTotal(): Promise<number> {
        const grandTotal = await this.grandTotalField.textContent();
        return this.parsePrice(grandTotal);
    }

    private parsePrice(priceText: string | null): number {
        if (!priceText) return 0;
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }
}