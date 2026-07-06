import path from 'node:path';
import { test, expect } from '@fixtures/test.fixtures';
import { readCsv } from '@helpers/read-csv';

const testData = readCsv<{ itemId: string }>(
  path.join(process.cwd(), 'test-data', 'product-data.csv'),
)[0];

test.describe('Cart', () => {
  test('should add item to cart and remove it from the cart', async ({ pom, page }) => {
    await pom.productPage.openProductPage(testData.itemId);
    await expect(pom.productPage.addToCartButton).toBeVisible();
    await pom.productPage.clickAddToCartButton();
    await expect(pom.addedToCartModal.heading).toBeVisible();
    await pom.addedToCartModal.clickSeeInCart();

    await expect(page).toHaveURL(/cart\.ebay\.com/);
    await expect(pom.cartPage.checkoutButton).toBeVisible();
    await expect(pom.cartPage.removeItemButton).toBeVisible();

    await pom.cartPage.clickRemoveFirstItem();
    await expect(pom.cartPage.emptyCartMessage).toBeVisible();
  });
});
