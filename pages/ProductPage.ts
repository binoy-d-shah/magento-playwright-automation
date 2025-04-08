import { Locator, Page } from '@playwright/test';
import { config } from '../utils/config';

export class ProductPage {
    private page: Page;
    private productTitle: Locator;
    private addtoCartButton: Locator;
    private successMessage: string;
    private showCartLink: Locator;
    private viewCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productTitle = page.locator('.page-title-wrapper');
        this.addtoCartButton = page.locator('[title="Add to Cart"]');
        this.successMessage = '.message-success';
        this.showCartLink = page.locator('.showcart');
        this.viewCartLink = page.locator('a.viewcart');
    }

    async getProductTitle() {
        return await this.productTitle.textContent();
    }

    async addToCart() {
        await this.addtoCartButton.click();
        await this.page.waitForSelector(this.successMessage);
    }

    async goToCart() {
        await this.showCartLink.click();
        await this.viewCartLink.click();
    }
}
