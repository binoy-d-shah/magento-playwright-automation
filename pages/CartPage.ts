import { Locator, Page } from '@playwright/test';
import { config } from '../utils/config';

export class CartPage {
    private page: Page;
    private proceedToCheckoutButton: Locator;
    private applyDiscountCodeLink: Locator;
    private discountCodeField: Locator;
    private applyDiscountButton: Locator;
    private discountSuccessMessage: Locator;
    private productQuantity: Locator;
    private updateShoppingCart: Locator;

    constructor(page: Page) {
        this.page = page;
        this.proceedToCheckoutButton = page.locator('//li/button[@title=\'Proceed to Checkout\']');
        this.applyDiscountCodeLink = page.locator('#block-discount');
        this.discountCodeField = page.locator('#coupon_code');
        this.applyDiscountButton = page.locator('button[value="Apply Discount"]');
        this.discountSuccessMessage = page.locator('.message-success.success.message');
        this.productQuantity = page.locator('input.qty').first();
        this.updateShoppingCart = page.locator('button.update')
    }

    async proceedToCheckout() {
        await this.page.waitForTimeout(2000);
        await this.proceedToCheckoutButton.click();
    }

    async applyDiscountCode(code: string) {
        await this.applyDiscountCodeLink.scrollIntoViewIfNeeded();
        await this.applyDiscountCodeLink.click();
        await this.discountCodeField.fill(code);
        await this.applyDiscountButton.click();
    }

    async getDiscountSuccessMessage() {
        return await this.discountSuccessMessage.textContent();
    }

    async updateQuantity(quantity: number) {
        await this.productQuantity.fill(quantity.toString());
        await this.updateShoppingCart.click();
        await this.page.waitForTimeout(3000);
    }

    async getTotalQuantity() {
        const qtyValue = await this.productQuantity.getAttribute('value');
        return Number(qtyValue);
    }
}
