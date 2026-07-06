import { type Page } from '@playwright/test';
import { waitForVerificationIfNeeded } from '@helpers/ebay-captcha-verification';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export abstract class PageObject {
  constructor(protected readonly page: Page) {}

  private async waitForCaptchaIfNeeded() {
    await waitForVerificationIfNeeded(this.page);
  }

  protected async goTo(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.waitForCaptchaIfNeeded();
  }

  protected async afterNavigation() {
    await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
    await this.waitForCaptchaIfNeeded();
  }

  private matchesPath(url: string, path: string, endsWith: boolean): boolean {
    return endsWith ? url.endsWith(path) || url.includes(`${path}?`) : url.includes(path);
  }

  protected async performActionAndWaitForResponse(
    action: () => Promise<void>,
    urlPath: string,
    method: HttpMethod = 'POST',
    endsWith = false,
  ): Promise<void> {
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.request().method() === method &&
          this.matchesPath(response.url(), urlPath, endsWith) &&
          response.ok(),
      ),
      action(),
    ]);
  }
}
