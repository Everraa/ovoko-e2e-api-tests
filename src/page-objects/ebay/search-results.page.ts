import { normalizeListingTitle } from '@helpers/normalize-listing-title';
import { TestStep } from '@helpers/test-step';
import { PageObject } from '@pages/page-object';

export class SearchResultsPage extends PageObject {
  get resultsHeading() {
    return this.page.getByRole('heading', { level: 1, name: /results for/i });
  }

  get listingCards() {
    return this.page
      .locator('.srp-river-results')
      .getByRole('heading', { level: 3 })
      .filter({ hasNotText: 'Shop on eBay' });
  }

  brandFilterLink(name: string) {
    return this.page.locator(`a[href*="Brand=${name}"]`).first();
  }

  @TestStep
  async clickBrandFilter(name: string) {
    await this.brandFilterLink(name).click();
    await this.page.waitForURL(new RegExp(`Brand=${name}`, 'i'));
  }

  @TestStep
  async applyPriceRange(min: number, max: number) {
    const url = new URL(this.page.url());
    url.searchParams.set('_udlo', String(min));
    url.searchParams.set('_udhi', String(max));
    await this.goTo(url.toString());
  }

  @TestStep
  async openListingPage(index: number) {
    const titleHeading = this.listingCards.nth(index - 1);
    await titleHeading.scrollIntoViewIfNeeded();

    const title = normalizeListingTitle(await titleHeading.innerText());
    const link = titleHeading.locator('xpath=ancestor::a[1]');
    const href = await link.getAttribute('href');

    if (!href) {
      throw new Error(`Listing ${index} link was not found`);
    }

    const itemId = href.match(/\/itm\/(\d+)/)?.[1];
    if (!itemId) {
      throw new Error(`Listing ${index} href did not contain an item id: ${href}`);
    }

    await this.goTo(href);

    return { itemId, title };
  }
}
