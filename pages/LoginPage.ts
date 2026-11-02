import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly username: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    // Locators exactly as captured by codegen. They are lazy, so they never go stale.
    this.username = page.locator('[data-test="username"]');
    this.password = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/'); // Resolved against baseURL from the config
  }

  async login(user: string, pass: string): Promise<void> {
    // fill() focuses and clears the field itself, so no click() is needed first
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }
}