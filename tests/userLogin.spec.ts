import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { generateRandomUser } from '../utils/dataProvider';
import { HomePage } from '../pages/HomePage';
import { loginTestData } from '../utils/loginTestData';

/**
 * @testSuite User Login Tests
 * @description This suite validates login functionality.
 */
test.describe('User Login Tests', () => {
    let loginPage, homePage, registrationPage;
    const randomUser = generateRandomUser();

    /**
     * @beforeEach Hook
     * @description Initializes required page objects and navigates to the login page before each test case.
     * @param {object} page - Playwright page object
     */
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        homePage = new HomePage(page);
        registrationPage = new RegistrationPage(page);
        
        // Navigate to Login Page
        await homePage.navigate();
        await homePage.navigateToRegistration();
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);
        await loginPage.logout();
        await homePage.navigateToLogin();
    });

    /**
     * @test TC-01 Login with Valid Credentials
     * @description Logs in a registered user with valid credentials and verifies success, then performs logout.
     */
    test('Login with valid credentials and logout', async () => {
        await loginPage.login(randomUser.email, randomUser.password);
        await expect(loginPage.isUserLoggedIn()).toBeTruthy();
        await loginPage.logout();
    });

    /**
     * @test TC-02 Login with Incorrect Password
     * @description Attempts login with correct email but incorrect password and validates error message.
     */
    test('Login with incorrect password', async () => {
        await loginPage.login(randomUser.email, loginTestData.invalidPassword.password);
        await expect(loginPage.getErrorMessage()).resolves.toContain(loginTestData.invalidPassword.errorMessage);
    });

    /**
     * @test TC-03 Login with Unregistered Email
     * @description Attempts login using an email that is not registered and checks for proper error message.
     */
    test('Login with unregistered email', async () => {
        await loginPage.login(loginTestData.unregisteredUser.email, loginTestData.unregisteredUser.password);
        await expect(loginPage.getErrorMessage()).resolves.toContain(loginTestData.unregisteredUser.errorMessage);
    });

    /**
     * @test TC-04 Login with Empty Credentials
     * @description Tries to log in with empty email and password fields and validates required field errors.
     */
    test('Login with empty credentials', async () => {
        await loginPage.login(loginTestData.emptyCredentials.email, loginTestData.emptyCredentials.password);
        await expect(loginPage.getEmailErrorMessage()).resolves.toContain(loginTestData.emptyCredentials.errorMessage);
        await expect(loginPage.getPasswordErrorMessage()).resolves.toContain(loginTestData.emptyCredentials.errorMessage);
    });

    /**
     * @test TC-05 Login with Invalid Email Format
     * @description Attempts login using an improperly formatted email and checks email validation error.
     */
    test('Login with invalid Email format', async () => {
        await loginPage.login(loginTestData.invalidEmailFormat.email, loginTestData.invalidEmailFormat.password);
        await expect(loginPage.getEmailErrorMessage()).resolves.toContain(loginTestData.invalidEmailFormat.errorMessage);
    });
    

    /**
     * @afterEach Hook
     * @description Closes the page after each test execution.
     */
    test.afterEach(async ({ page }) => {
        page.close();
    });
});
