# Ovoko — Playwright Automation

TypeScript test automation built with **Playwright**. The project contains two independent test suites that share the same runner, config, and HTML report.

| Suite | Target | How it runs |
|-------|--------|-------------|
| **E2E** | [eBay](https://www.ebay.com) UI | Real browsers (Chrome, Firefox, WebKit) + Page Object Model |
| **API** | [Swagger Petstore](https://petstore.swagger.io) | HTTP requests only — no browser needed |

---

## Getting started

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Node.js 18+** | Check with `node -v` |
| **npm** | Included with Node.js; check with `npm -v` |
| **Git** | To clone the repository |

No `.env` file is required. Both suites run against public endpoints.

### Clone and install

```bash
git clone https://github.com/Everraa/ovoko-e2e-api-tests.git
cd ovoko-e2e-api-tests
npm install
```

---

## Project structure

```
ovoko-e2e-api-tests/
├── tests/
│   ├── e2e/                      # eBay UI specs + visual baselines (visuals/)
│   └── api/                      # Petstore API specs
├── src/
│   ├── page-objects/ebay/        # Page Object Model (pages, modals)
│   ├── api/petstore/             # API clients (PetClient, StoreClient)
│   ├── fixtures/                 # E2E (`pom`) and API (`petClient`, `storeClient`)
│   ├── helpers/                  # CSV, faker, delete retry, captcha, cookies, title normalization
│   └── config/                   # env.ts, ebay-api-paths.ts
├── test-data/                    # CSV test data (e2e)
├── playwright.config.ts
├── playwright-report/            # HTML report (generated)
└── test-results/                 # Artifacts (generated)
```

Open the last HTML report:

```bash
npm run test:report
```

---

## E2E tests (eBay)

UI tests using the **Page Object Model**. **Target:** `https://www.ebay.com`

### Setup — install browsers

API tests do not need browsers. For eBay:

```bash
npx playwright install chromium firefox
```

On Linux: `npx playwright install-deps chromium firefox`

### Run E2E tests

```bash
npm run test:browsers              # Chrome + Firefox (recommended)
npm run test:browsers:report       # run + open HTML report
npm run test:browsers -- tests/e2e/search-product-open-listing.spec.ts   # single spec
```

### E2E test specs

| Spec | What it covers |
|------|----------------|
| `search-product-open-listing.spec.ts` | Search, filter by brand and price, open a listing, compare title prefix |
| `product-add-to-cart-and-remove.spec.ts` | Add to cart, open cart, remove item |
| `product-buy-it-now-guest-checkout.spec.ts` | Buy It Now → guest checkout → shipping and card payment |
| `product-invalid-item.spec.ts` | Invalid item ID shows error banner (visual snapshot) |

Visual baselines for `product-invalid-item.spec.ts` live in `tests/e2e/visuals/` — one snapshot per browser (e.g. chromium, firefox).

### E2E test data

| File | Contents |
|------|----------|
| `test-data/product-search-filters.csv` | Search term, brand, min/max price, listing index |
| `test-data/product-data.csv` | Valid `itemId` and `invalidItemId` |

Guest checkout uses **5 validated US addresses** from `src/helpers/generate-shipping-address.ts` (random pick per run).

**Listing sold out?** Replace `itemId` in `test-data/product-data.csv` with an active **Buy It Now** listing.

**Direct `/itm/...` URLs:** `ProductPage.openProductPage()` visits the homepage first, then the listing.

### Verification screen (manual step)

Cart/checkout may show **"Please verify yourself to continue"** (hCaptcha). Tests pause up to 5 minutes for you to complete it in the browser. Most common in cart and checkout specs — run **headed** locally.

### E2E troubleshooting

**Checkout fails after selecting country** — `fillShippingAddress()` waits for the state dropdown after the country API call, fills address fields first, then first/last name last (eBay re-renders the form). The spec asserts first and last name values before saving.

**Browsers not found** — run `npx playwright install chromium firefox`.

---

## API tests (Petstore)

HTTP tests via Playwright's `request` fixture. **Target:** `https://petstore.swagger.io/v2/`

```
tests/api/pet-order-lifecycle.spec.ts
  └── api.fixtures.ts → src/api/petstore/ (pet.client.ts, store.client.ts)
```

- Pet **DELETE** uses header `api_key: special-key`
- **DELETE** calls retry automatically (`delete-with-retry.ts`) — the public demo API can be flaky

### Configuration & API key

`special-key` is committed in `src/config/env.ts` on purpose — it is the [public Swagger Petstore demo key](https://petstore.swagger.io), not a production secret.

API client paths are relative (`pet`, `store/order/...`) because the base URL includes a trailing slash (`/v2/`).

### Run API tests

```bash
npm run test:api
npm run test:api:report    # run + open HTML report
```

### API test specs

| Spec | What it covers |
|------|----------------|
| `pet-order-lifecycle.spec.ts` | Create 4 available pets → place multiple orders per pet → delete all → verify 404 |

Tests run **serially** (`describe.serial`). `afterAll` cleans up leftover data if a step fails.

Additional test ideas (not automated) are in comments at the bottom of the spec.

### API troubleshooting

Re-run `npm run test:api` if create/delete fails — the shared demo API is intermittent.

---

## Lint and format

```bash
npm run lint
npm run format:check
npm run format
```
