import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly itemNames: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    // NOTE: 'inventory-item-name' is not from your recording; verify it in the Inspector.
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]'); // from codegen
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}