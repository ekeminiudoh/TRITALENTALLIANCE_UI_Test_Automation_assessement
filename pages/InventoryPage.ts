import { type Locator, type Page } from '@playwright/test';
import { toCents } from '../utils/money';

export class InventoryPage {
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator('[data-test="shopping-cart-link"]'); // from codegen
  }

  // "Sauce Labs Backpack" -> "sauce-labs-backpack", matching the ids codegen captured
  private slug(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  private addToCartButton(productName: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${this.slug(productName)}"]`); // from codegen
  }

  // Finds the product card that contains this product's Add-to-cart button, so the price
  // we read always belongs to the same product we add.
  // NOTE: 'inventory-item' and 'inventory-item-price' are not from your recording.
  private priceLabel(productName: string): Locator {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ has: this.addToCartButton(productName) })
      .locator('[data-test="inventory-item-price"]');
  }

  // Reads the price shown on the page (replaces the hardcoded getByText('$29.99'))
  async getPriceInCents(productName: string): Promise<number> {
    return toCents(await this.priceLabel(productName).innerText()); // innerText auto-waits
  }

  async addToCart(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}