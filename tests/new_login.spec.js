import { test } from '@playwright/test';
import { LoginPage } from '../pageObjects/login.po.js';
import { ContactPage } from '../pageObjects/contact.po.js';
import testdata from '../fixtures/loginFixtures.json' assert { type: 'json' };


test.beforeEach(async ({ page }) => {
    await page.goto('/');
});

test.describe('Login Tests', () => {

    test('TC01: Valid login', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testdata.validUser.username, testdata.validUser.password);
        await login.verifyValidLogin();
    });

    test('TC02: Invalid username + valid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testdata.invalidUser.username, testdata.invalidUser.password);
        await login.verifyInvalidLogin();
    });

    test('TC03: Valid username + invalid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testdata.validUser.username, testdata.invalidUser.password);
        await login.verifyInvalidLogin();
    });

    test('TC04: Invalid username + invalid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testdata.invalidUser.username, testdata.invalidUser.password);
        await login.verifyInvalidLogin();
    });

    test('TC05: Empty username + valid password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login('', testdata.validUser.password);
        await login.verifyInvalidLogin();
    });

    test('TC06: Valid username + empty password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login(testdata.validUser.username, '');
        await login.verifyInvalidLogin();
    });

    test('TC07: Empty username + empty password', async ({ page }) => {
        const login = new LoginPage(page);
        await login.login('', '');
        await login.verifyInvalidLogin();
    });

});