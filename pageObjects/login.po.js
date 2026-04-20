import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = '#email';
    this.password = '#password';
    this.loginBtn = '#submit';
    this.logoutBtn = '#logout';
    this.errorMsg = '#error';
  }

  async login(username, password) {
    await this.page.fill(this.username, username);
    await this.page.fill(this.password, password);
    await this.page.click(this.loginBtn);
  }

  async verifyValidLogin() {
    await expect(this.page.locator(this.logoutBtn)).toBeVisible();
  }

  async verifyInvalidLogin() {
    await expect(this.page.locator(this.errorMsg)).toBeVisible();
  }
}