import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { generateRandomUser } from '../utils/dataProvider';
import { MyAccountPage } from '../pages/MyAccountPage';
import { registrationTestData } from '../utils/registrationTestData';

/**
 * @testSuite User Registration Tests
 * @description Verifies different user registration scenarios, including positive and negative cases.
 */
test.describe('User Registration Tests', () => {

    let homePage, registrationPage, myAccountPage;

    const randomUser = generateRandomUser();

    /**
     * @beforeEach Hook
     * @description Initializes page objects and navigates to the registration page.
     */
    test.beforeEach(async ({ page }) => {
        
        homePage = new HomePage(page);
        registrationPage = new RegistrationPage(page);
        myAccountPage = new MyAccountPage(page);

        // Navigate to Registration Page
        await homePage.navigate();
        await homePage.navigateToRegistration();
    });

    /**
     * @test TC-01 Successful Registration
     * @description Verifies that a user can register with valid credentials.
     */
    test('User should be able to register with valid data', async () => {

        // Register a new user
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, randomUser.password);

        // Verify successful registration (e.g. check if redirected to homepage or profile page)
        await expect(myAccountPage.getSuccessMessage()).resolves.toContain(registrationTestData.validUser.message);
    });

    /**
     * @test TC-02 Registration with Existing Email
     * @description Checks if the system prevents duplicate email registration.
     */
    test('Registration with Existing Email', async () => {
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, registrationTestData.existingEmail.email, randomUser.password, randomUser.password);
        
        await expect(registrationPage.getErrorMessage()).resolves.toContain(registrationTestData.existingEmail.message);
    });

    /**
     * @test TC-03 Registration with Invalid Email Format
     * @description Ensures validation for incorrect email formats.
     */
    test('Registration with Invalid Email Format', async () => {
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, registrationTestData.invalidEmail.email, randomUser.password, randomUser.password);
        
        await expect(registrationPage.getEmailErrorMessage()).resolves.toContain(registrationTestData.invalidEmail.message);
    });

    /**
     * @test TC-04 Registration with Weak Password
     * @description Validates password strength enforcement.
     */
    test('Registration with Weak Password', async () => {
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, registrationTestData.weakPassword.password, randomUser.password);
        
        await expect(registrationPage.getPasswordErrorMessage()).resolves.toContain(registrationTestData.weakPassword.message);
    });

    /**
     * @test TC-05 Registration with Empty Fields
     * @description Ensures required fields are properly validated.
     */
    test('Registration with Empty Fields', async () => {
        await registrationPage.registerUser('', '', '', '', '', '');
        
        await expect(registrationPage.getFirstNameErrorMessage()).resolves.toContain(registrationTestData.empltyFields.message);
        await expect(registrationPage.getLastNameErrorMessage()).resolves.toContain(registrationTestData.empltyFields.message);
        await expect(registrationPage.getEmailErrorMessage()).resolves.toContain(registrationTestData.empltyFields.message);
        await expect(registrationPage.getPasswordConfirmationErrorMessage()).resolves.toContain(registrationTestData.empltyFields.message);
        await expect(registrationPage.getPasswordErrorMessage()).resolves.toContain(registrationTestData.empltyFields.message);
    });

    /**
     * @test TC-06 Registration with Mismatched Passwords
     * @description Ensures users cannot register with mismatched passwords.
     */
    test('Registration with Mismatched Password and Confirm Password', async () => {
        await registrationPage.registerUser(randomUser.firstName, randomUser.lastName, randomUser.email, randomUser.password, registrationTestData.mismatchedPassword.password);
        
        await expect(registrationPage.getPasswordConfirmationErrorMessage()).resolves.toContain(registrationTestData.mismatchedPassword.message);
    });

    /**
     * @afterEach Hook
     * @description Closes the page after each test execution.
     */
    test.afterEach(async ({ page }) => {
        page.close();
    });
});
