import { test, expect } from '@playwright/test';
import { MyAccountPage } from '../pages/MyAccountPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { generateRandomUser } from '../utils/dataProvider';
import { RegistrationPage } from '../pages/RegistrationPage';
import { accountTestData } from '../utils/accountTestData';
import { registrationTestData } from '../utils/registrationTestData';

/**
 * @testSuite My Account Management
 * @description This suite validates My Account functionality.
 */
test.describe('User My Account Tests', () => {
    let myAccountPage, homePage, loginPage, registrationPage;
    let randomUser;

    /**
     * @beforeEach Hook
     * @description Sets up the necessary pages and navigates to the account page before each test.
     */
    test.beforeEach(async ({ page }) => {
        myAccountPage = new MyAccountPage(page);
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        registrationPage = new RegistrationPage(page);
        randomUser = generateRandomUser();
        
         // Navigate to Account Page
        await homePage.navigate();
        await homePage.navigateToMyAccountPage();

    });

    /**
     * @test TC-01 Update Profile Information
     * @description Verifies that a user can successfully update their first and last name.
     */
    test('User should be able to update first name and last name', async () => {

        await homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);
        await myAccountPage.updateProfile(randomUser.firstName, randomUser.lastName);
        await expect(myAccountPage.getSuccessMessage()).resolves.toContain(accountTestData.successMessage);
    });

    /**
     * @test TC-02 Change Password
     * @description Verifies that a user can change their account password successfully.
     */
    test('User should be able to change password', async () => {

        await homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);
        await myAccountPage.changePassword(randomUser.password, accountTestData.newPassword, accountTestData.newPassword);
        await expect(myAccountPage.getSuccessMessage()).resolves.toContain(accountTestData.successMessage);
        await loginPage.login(randomUser.email, accountTestData.newPassword);
        await expect(loginPage.isUserLoggedIn()).toBeTruthy(); 
        await loginPage.logout();
    });

    /**
     * @test TC-03 Invalid Password Format
     * @description Verifies that the user gets an error when trying to set a weak password.
     */
    test('User should get an error when trying to set a password with an incorrect format', async () => {
        await homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);
        await myAccountPage.changePassword(randomUser.password, '123', '123');
        await expect(myAccountPage.getPasswordErrorMessage()).resolves.toContain(accountTestData.weakPasswordErrorMessage);
    });

    /**
     * @test TC-04 Incorrect Current Password
     * @description Verifies that the user receives an error when entering the wrong current password.
     */
    test('User should get an error when providing wrong current password', async () => {
        await homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);
        await myAccountPage.changePassword(accountTestData.wrongPassword, randomUser.password, randomUser.password);
        await expect(myAccountPage.getErrorMessage()).resolves.toContain('The password doesn\'t match this account. Verify the password and try again.');
    });

    /**
     * @test TC-05 Mismatched Passwords
     * @description Verifies that the user gets an error when the new password and confirm password don't match.
     */
    test('User should get an error when new password and confirm new password doesn\'t match', async () => {
        await homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);
        await myAccountPage.changePassword(randomUser.password, randomUser.password, accountTestData.mismatchedPassword);
        await expect(myAccountPage.getPasswordConfirmationErrorMessage()).resolves.toContain(accountTestData.mistmatchedPasswordErrorMessage);
    });

    /**
     * @test TC-06 Password Same as Current
     * @description Verifies that the user gets an error when attempting to change their password to the same as the current password.
     */
    test('User should get an error when changing the password to the same as the current password', async () => {
        await homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);
        await myAccountPage.changePassword(randomUser.password, randomUser.password, randomUser.password);
        await expect(myAccountPage.getErrorMessage()).resolves.toContain(accountTestData.errorMessage);
    });

    /**
     * @afterEach Hook
     * @description Closes the page after each test execution.
     */
    test.afterEach(async ({ page }) => {
        page.close();
    });
});
