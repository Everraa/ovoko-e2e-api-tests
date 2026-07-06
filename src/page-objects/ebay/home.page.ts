import { env } from '@config/env';
import { acceptAllCookiesIfVisible } from '@helpers/accept-cookie-consent';
import { TestStep } from '@helpers/test-step';
import { PageObject } from '@pages/page-object';

export class HomePage extends PageObject {
  get searchInput() {
    return this.page.getByPlaceholder('Search for anything');
  }

  get searchButton() {
    return this.page.getByRole('button', { name: 'Search', exact: true });
  }

  @TestStep
  async openHomePage() {
    await this.goTo(env.BASE_URL);
    await acceptAllCookiesIfVisible(this.page);
  }

  @TestStep
  async fillSearchInput(term: string) {
    await this.searchInput.fill(term);
  }

  @TestStep
  async clickSearchButton() {
    await this.searchButton.click();
  }
}
