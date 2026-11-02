// Single source of truth for test data. Tests contain logic only; values live here.
// URL and credentials can be overridden by env vars (e.g. in CI) without touching code.

export interface User {
  username: string;
  password: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface CheckoutScenario {
  name: string;        // Becomes the test title, so it must be unique
  products: string[];  // Exact product names as shown on the inventory page
  customer: CustomerInfo;
}

export const ENV = {
  uiBaseUrl: process.env.UI_BASE_URL ?? 'https://www.saucedemo.com',
};

export const USERS: Record<string, User> = {
  standard: {
    username: process.env.SAUCE_USER ?? 'standard_user',
    password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
  },
};

const DEFAULT_CUSTOMER: CustomerInfo = {
  firstName: 'Ekemini',
  lastName: 'Udoh',
  postalCode: '105101',
};

// InventoryPage converts each name to its data-test id
// ("Sauce Labs Backpack" -> add-to-cart-sauce-labs-backpack),
// so only use names whose ids follow that pattern.
export const CHECKOUT_SCENARIOS: CheckoutScenario[] = [
  {
    // The scenario required by the assessment
    name: 'Backpack + Bike Light',
    products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light'],
    customer: DEFAULT_CUSTOMER,
  },
  {
    name: 'Single item: Bolt T-Shirt',
    products: ['Sauce Labs Bolt T-Shirt'],
    customer: DEFAULT_CUSTOMER,
  },
  {
    name: 'Three items: Backpack + Bike Light + Fleece Jacket',
    products: ['Sauce Labs Backpack', 'Sauce Labs Bike Light', 'Sauce Labs Fleece Jacket'],
    customer: { ...DEFAULT_CUSTOMER, firstName: 'Ada', lastName: 'Okon' },
  },
];