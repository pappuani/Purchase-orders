import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"], input[placeholder*="email" i], input[name="email"]');
    this.passwordInput = page.locator('input[type="password"], input[placeholder*="password" i], input[name="password"]');
    this.loginButton = page.getByRole('button', { name: /login|sign in/i });
  }

  /**
   * Performs login operation with email and password
   */
  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }
}
