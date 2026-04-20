import { test } from '@playwright/test';
import { LoginPage } from '../pageObjects/login.po.js';
import { ContactPage } from '../pageObjects/contact.po.js';

test.describe('Hamro CSIT Login Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://hamrocsit.com/account/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Handle popup if present
    const closePopupBtn = page.locator('.pum-close, .popmake-close, button[aria-label="Close"]');
    if (await closePopupBtn.isVisible().catch(() => false)) {
      await closePopupBtn.click();
    }
  });

  test('TC01: Valid username + Valid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('maskeyashmi@gmail.com', 'Ashmi@123');
    await login.verifyValidLogin();
  });

  test('TC02: Valid username + Invalid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('maskeyashmi@gmail.com', 'invalidPassword');
    await login.verifyInvalidLogin();
  });

  test('TC03: Invalid username + Valid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('invalidUsername', 'Ashmi@123');
    await login.verifyInvalidLogin();
  });

  test('TC04: Invalid username + Invalid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('invalidUsername', 'invalidPassword');
    await login.verifyInvalidLogin();
  });

  test('TC05: Empty username + Valid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('', 'Ashmi@123');
    await login.verifyInvalidLogin();
  });

  test('TC06: Valid username + Empty password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('maskeyashmi@gmail.com', '');
    await login.verifyInvalidLogin();
  });

  test('TC07: Empty username + Empty password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('', '');
    await login.verifyInvalidLogin();
  });

});