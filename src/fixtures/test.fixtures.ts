import { test as base, expect } from '@playwright/test';
import { PageObjectManager } from '@pages/page-object-manager';

type Fixtures = {
  pom: PageObjectManager;
};

export const test = base.extend<Fixtures>({
  pom: async ({ page }, use) => {
    await use(new PageObjectManager(page));
  },
});

export { expect };
