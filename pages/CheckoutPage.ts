import { type Locator, type Page } from '@playwright/test';
import { toCents } from '../utils/money';
import { type CustomerInfo } from '../config/test-data';

export class CheckoutPage {
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly postalCode: Locator;
  private readonly continueButton: Locator;
  private readonly subtotalLabel: Locator;
  private readonly finishButton: Locator;
  readonly completeText: Locator;

  constructor(page: Page) {
    // All locators exactly as captured by codegen
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeText = page.locator('[data-test="complete-text"]');
  }

  async fillInformation(info: CustomerInfo): Promise<void> {
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  // Reads the "Item total: $39.98" label (pre-tax) and returns cents
  async getItemTotalInCents(): Promise<number> {
    return toCents(await this.subtotalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}