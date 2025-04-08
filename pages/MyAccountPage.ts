import { Locator, Page } from '@playwright/test';

export class MyAccountPage {

    readonly page: Page;
    private firstNameField: Locator;
    private lastNameField: Locator;
    private currentPasswordField: Locator;
    private newPasswordField: Locator;
    private confirmNewPasswordField: Locator;
    private saveButton: Locator;
    private passwordErrorMessage: Locator;
    private passwordConfirmationErrorMessage: Locator;
    private successMessage: Locator;
    private errorMessage: Locator;
    private editLink: Locator;
    private changePasswordLink: Locator;
    

    constructor(page: Page) {
        this.page = page;
        this.successMessage = page.locator('.message-success');
        this.errorMessage = page.locator('.message-error');
        this.firstNameField = page.locator('#firstname');
        this.lastNameField = page.locator('#lastname');
        this.changePasswordLink = page.locator(".change-password");
        this.currentPasswordField = page.locator('#current-password');
        this.newPasswordField = page.locator('#password');
        this.confirmNewPasswordField = page.locator('#password-confirmation');
        this.saveButton = page.locator('button[title="Save"]');
        this.passwordErrorMessage = page.locator('#password-error');
        this.passwordConfirmationErrorMessage = page.locator('#password-confirmation-error');
        this.editLink = page.locator('//a/span[text()="Edit"]');
        
    }

    async updateProfile(firstName: string, lastName: string) {
        await this.editLink.click();
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.saveButton.click();
    }

    async changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string) {
        await this.changePasswordLink.click();
        await this.currentPasswordField.fill(currentPassword);
        await this.newPasswordField.fill(newPassword);
        await this.confirmNewPasswordField.fill(confirmNewPassword);
        await this.saveButton.click();
    }

    async getPasswordErrorMessage() {
        return await this.passwordErrorMessage.textContent();
    }

    async getPasswordConfirmationErrorMessage() {
        return await this.passwordConfirmationErrorMessage.textContent();
    }

    async getSuccessMessage() {
        return await this.successMessage.textContent();
    }

    async getErrorMessage() {
        return await this.errorMessage.textContent();
    }
}
