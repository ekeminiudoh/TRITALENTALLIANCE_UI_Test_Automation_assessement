# TRITALENTALLIANCE_UI_Test_Automation_assessement

# SauceDemo UI Tests: Playwright + TypeScript

Data-driven UI checkout test for [SauceDemo](https://www.saucedemo.com).
The test logs in as `standard_user`, adds products to the cart, completes checkout, and asserts that
the **Item total equals the sum of the product prices read dynamically from the page**.

## Prerequisites
- Node.js 18+ (20 LTS recommended)
- npm

## Setup
```bash
npm install
npx playwright install chromium
```

## Running the tests
| Goal | Command |
|------|---------|
| All scenarios (headless) | `npm test` |
| Watch the browser | `npm run test:headed` |
| Assessment scenario only | `npx playwright test -g "Backpack + Bike Light"` |
| Debug with Inspector | `npx playwright test --debug` |
| Open the HTML report | `npm run report` |

Optional environment overrides: `UI_BASE_URL`, `SAUCE_USER`, `SAUCE_PASSWORD`, `CI=1`.

## Project layout
```
config/test-data.ts      Test data: URL, users, checkout scenarios
pages/                   Page Objects (Login, Inventory, Cart, Checkout)
utils/money.ts           Price parsing in integer cents
tests/ui/checkout.spec.ts  One generated test per scenario
playwright.config.ts     Timeouts, reporters, baseURL, trace/screenshot/video
```

## Design notes
- **Page Object Model:** locators and page actions live in `pages/`; assertions stay in the spec.
- **Data-driven:** to add a case, add one object to `CHECKOUT_SCENARIOS` in `config/test-data.ts`. No test code changes.
- **No fixed waits:** the suite uses Playwright auto-waiting and web-first assertions (`toHaveURL`, `toHaveText`, `toBeVisible`). There is no `waitForTimeout`.
- **Money in cents:** prices are parsed to integers so the sum comparison has no floating-point error.
- **Diagnostics:** traces on first retry, screenshots and video only on failure.

## Defect Report

### DEF-001: Checkout can be completed with an empty cart
| Field | Detail |
|-------|--------|
| **Application & Environment** | SauceDemo (https://www.saucedemo.com), Chrome (latest), Windows/macOS, user `standard_user` |
| **Severity** | Medium (business-logic gap: an order with no items and a $0.00 total is accepted) |

**Steps to reproduce**
1. Go to https://www.saucedemo.com and log in as `standard_user` / `secret_sauce`.
2. Without adding any product, click the cart icon (top right).
3. On the empty cart page, click **Checkout**.
4. Enter First Name, Last Name and Postal Code, then click **Continue**.
5. On the overview page, click **Finish**.

**Expected result:** Checkout is blocked (button disabled, or a message such as "Your cart is empty"),
so no order can be placed without at least one item.

**Actual result:** The flow proceeds through every step, shows an overview with Item total $0.00, and
ends on "Thank you for your order!", so an order is confirmed for an empty cart.