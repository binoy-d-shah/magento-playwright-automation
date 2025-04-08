import { Locator, Page } from '@playwright/test';

export class RegistrationPage {
    private page: Page;
    private firstNameField: Locator;
    private lastNameField: Locator;
    private emailField: Locator;
    private passwordField: Locator;
    private confirmPasswordField: Locator;
    private createAccountButton: Locator;
    private errorMessage: Locator;
    private emailErrorMessage: Locator;
    private passwordErrorMessage: Locator;
    private firstNameErrorMessage: Locator;
    private lastNameErrorMessage: Locator;
    private passwordConfirmationErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameField = page.locator('#firstname');
        this.lastNameField = page.locator('#lastname');
        this.emailField = page.locator('#email_address');
        this.passwordField = page.locator('#password');
        this.confirmPasswordField = page.locator('#password-confirmation');
        this.createAccountButton = page.locator('button[title="Create an Account"]');
        this.errorMessage = page.locator('.message-error');
        this.emailErrorMessage = page.locator('#email_address-error');
        this.passwordErrorMessage = page.locator('#password-error');
        this.firstNameErrorMessage = page.locator('#firstname-error');
        this.lastNameErrorMessage = page.locator('#lastname-error');
        this.passwordConfirmationErrorMessage = page.locator('#password-confirmation-error');

    }

    async registerUser(firstName: string, lastName: string, email: string, password: string, confirmPasswordField: string) {
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.confirmPasswordField.fill(confirmPasswordField);
        await this.createAccountButton.click();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
    
    async getFirstNameErrorMessage() {
        return await this.firstNameErrorMessage.textContent();;
    }
    
    async getLastNameErrorMessage() {
        return await this.lastNameErrorMessage.textContent();;
    }

    async getEmailErrorMessage() {
        return await this.emailErrorMessage.textContent();;
    }

    async getPasswordErrorMessage() {
        return await this.passwordErrorMessage.textContent();
    }

    async getPasswordConfirmationErrorMessage() {
        return await this.passwordConfirmationErrorMessage.textContent();
    }
}
