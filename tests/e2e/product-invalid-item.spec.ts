import path from 'node:path';
import { test, expect } from '@fixtures/test.fixtures';
import { readCsv } from '@helpers/read-csv';
import { acceptAllCookiesIfVisible } from '@helpers/accept-cookie-consent';

const testData = readCsv<{ invalidItemId: string }>(
  path.join(process.cwd(), 'test-data', 'product-data.csv'),
)[0];

const testName = path.basename(__filename, '.spec.ts');

test.describe('Product page', () => {
  test('should show an error when opening a non-existent product item', async ({ pom, page }) => {
    await pom.productPage.openProductPage(testData.invalidItemId);
    await expect(page).toHaveURL(new RegExp(`/itm/${testData.invalidItemId}`));
    await acceptAllCookiesIfVisible(page);

    const errorBanner = pom.productPage.itemNotFoundErrorBanner;
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toHaveScreenshot([testName, 'item-not-found-error-message.png']);
  });
});
