import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { formatCents } from '../../utils/money';
import { CHECKOUT_SCENARIOS, USERS } from '../../config/test-data';

// One generated test per scenario. Each runs in its own isolated browser context,
// so scenarios can run in parallel without sharing cart state.
for (const scenario of CHECKOUT_SCENARIOS) {
  test(`item total equals sum of prices: ${scenario.name}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('Log in', async () => {
      await loginPage.goto();
      await loginPage.login(USERS.standard.username, USERS.standard.password);
      // Web-first assertion: retries until the inventory page loads (no fixed waits)
      await expect(page).toHaveURL(/inventory\.html/);
    });

    // Prices are read from the page at runtime, in cents; nothing is hardcoded
    const prices: number[] = [];

    await test.step(`Add ${scenario.products.length} product(s) to the cart`, async () => {
      for (const name of scenario.products) {
        prices.push(await inventoryPage.getPriceInCents(name)); // read BEFORE adding
        await inventoryPage.addToCart(name);
      }
    });

    await test.step('Open cart and verify contents', async () => {
      await inventoryPage.openCart();
      // Array form asserts exact count and order of the cart items
      await expect(cartPage.itemNames).toHaveText(scenario.products);
    });

    await test.step('Enter customer information', async () => {
      await cartPage.startCheckout();
      await checkoutPage.fillInformation(scenario.customer);
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    });

    await test.step('Assert Item total equals the sum of product prices', async () => {
      const expected = prices.reduce((sum, p) => sum + p, 0);
      const actual = await checkoutPage.getItemTotalInCents();
      expect(
        actual,
        `[${scenario.name}] Item total ${formatCents(actual)} should equal ${formatCents(expected)}`,
      ).toBe(expected);
    });

    await test.step('Finish checkout', async () => {
      await checkoutPage.finish();
      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutPage.completeText).toBeVisible(); // locator from your recording
    });
  });
}