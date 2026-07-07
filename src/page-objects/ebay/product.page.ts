import { env } from '@config/env';
import { acceptAllCookiesIfVisible } from '@helpers/accept-cookie-consent';
import { TestStep } from '@helpers/test-step';
import { PageObject } from '@pages/page-object';

export class ProductPage extends PageObject {
  private actionButton(label: RegExp) {
    return this.page.locator('main a[role="button"]').filter({ hasText: label });
  }

  get buyItNowButton() {
    return this.actionButton(/^Buy It Now$/);
  }

  get addToCartButton() {
    return this.actionButton(/^Add to cart$/);
  }

  get titleHeading() {
    return this.page.locator('h1.x-item-title__mainTitle');
  }

  get itemNotFoundErrorBanner() {
    return this.page.locator('.dp-error-banner-container__container');
  }

  @TestStep
  async openProductPage(itemId: string) {
    await this.goTo(env.BASE_URL);
    await this.goTo(`${env.BASE_URL}/itm/${itemId}`);
    await acceptAllCookiesIfVisible(this.page);
  }

  @TestStep
  async clickBuyItNowButton() {
    await this.buyItNowButton.click();
    await this.afterNavigation();
  }

  @TestStep
  async clickAddToCartButton() {
    await this.addToCartButton.click();
    await this.afterNavigation();
  }
}
