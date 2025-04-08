import { Locator, Page } from '@playwright/test';
import { config } from '../utils/config';

export class LoginPage {
    private page: Page;
    private emailField: Locator;
    private passwordField: Locator;
    private submitButton: Locator;
    private errorMessage: Locator;
    private customerMenuToggle: Locator;
    private loginButton: Locator;
    private emailErrorMessage: Locator;
    private passwordErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailField = page.locator('#email');
        this.passwordField = page.locator('//input[@title="Password"]');
        this.loginButton = page.locator('#send2');
        this.errorMessage = page.locator('.message-error');
        this.customerMenuToggle = page.locator('//button[@data-action=\'customer-menu-toggle\']');
        this.emailErrorMessage = page.locator("#email-error");
        this.passwordErrorMessage = page.locator("#pass-error");
    }

    async login(email: string, password: string) {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginButton.first().click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }

    async getEmailErrorMessage() {
        return await this.emailErrorMessage.textContent();
    }

    async getPasswordErrorMessage() {
        return await this.passwordErrorMessage.textContent();
    }

    async isUserLoggedIn() {
        return await this.customerMenuToggle.first().isVisible();
    }

    async logout() {
        await this.page.goto(config.baseUrl + config.logoutUrl);
    }
}