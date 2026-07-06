import path from 'node:path';
import { env } from '@config/env';
import { test, expect } from '@fixtures/test.fixtures';
import { listingTitlePrefixPattern } from '@helpers/normalize-listing-title';
import { readCsv } from '@helpers/read-csv';

const testData = readCsv<{
  searchTerm: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  listingIndex: string;
}>(path.join(process.cwd(), 'test-data', 'product-search-filters.csv'))[0];

test.describe('Search results', () => {
  test('should open a product item after filtering search results by brand and price', async ({
    pom,
    page,
  }) => {
    await pom.homePage.openHomePage();
    await expect(page).toHaveURL(env.BASE_URL);

    await pom.homePage.fillSearchInput(testData.searchTerm);
    await pom.homePage.clickSearchButton();
    await expect(page).toHaveURL(/\/sch\//);
    await expect(pom.searchResultsPage.resultsHeading).toContainText(
      new RegExp(testData.searchTerm, 'i'),
    );

    await pom.searchResultsPage.clickBrandFilter(testData.brand);
    await expect(page).toHaveURL(new RegExp(`Brand=${testData.brand}`, 'i'));

    await pom.searchResultsPage.applyPriceRange(
      Number(testData.minPrice),
      Number(testData.maxPrice),
    );
    await expect(page).toHaveURL(new RegExp(`_udlo=${testData.minPrice}`));
    await expect(page).toHaveURL(new RegExp(`_udhi=${testData.maxPrice}`));
    await expect(pom.searchResultsPage.resultsHeading).toBeVisible();

    await expect(
      pom.searchResultsPage.listingCards.nth(Number(testData.listingIndex) - 1),
    ).toBeVisible();

    const listing = await pom.searchResultsPage.openListingPage(Number(testData.listingIndex));
    await expect(page).toHaveURL(new RegExp(`/itm/${listing.itemId}`));
    await expect(pom.productPage.titleHeading).toBeVisible();
    await expect(pom.productPage.titleHeading).toHaveText(listingTitlePrefixPattern(listing.title));
    await expect(pom.productPage.addToCartButton).toBeVisible();
  });
});
