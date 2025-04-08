import { Locator, Page } from '@playwright/test';
import { config } from '../utils/config';

export class HomePage {
    private page: Page;
    private signInLink: Locator;
    private createAccountLink: Locator;
    private agreeButton: Locator;
    private searchField: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInLink = page.locator('//a[contains(text(),"Sign In"]');
        this.createAccountLink = page.locator('//a[text()="Create an Account"]');
        this.agreeButton = page.locator('button[id="accept-btn"]');
        this.searchField = page.locator('#search');
    }

    async navigate() {
        await this.page.goto(config.baseUrl);
        
        try { 
            if(await this.agreeButton.isVisible())
                await this.agreeButton.click();
        } catch {}
    }

    async navigateToLogin() {
        await this.page.goto(config.baseUrl + config.loginUrl);
    }

    async navigateToRegistration() {
        await this.createAccountLink.first().click();
    }

    async navigateToMyAccountPage() {
        await this.page.goto(config.baseUrl + config.myAccountUrl);
    }

    async searchForProduct(productName: string) {
        await this.searchField.fill(productName);
        await this.searchField.press('Enter');
    }
}
