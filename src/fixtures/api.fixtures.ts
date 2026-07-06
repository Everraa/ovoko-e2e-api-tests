import { test as base, expect } from '@playwright/test';
import { env } from '@config/env';
import { PetClient } from '@api/petstore/pet.client';
import { StoreClient } from '@api/petstore/store.client';

type ApiFixtures = {
  petClient: PetClient;
  storeClient: StoreClient;
};

export const test = base.extend<ApiFixtures>({
  request: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: env.PETSTORE_BASE_URL,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    await use(context);
    await context.dispose();
  },
  petClient: async ({ request }, use) => {
    await use(new PetClient(request));
  },
  storeClient: async ({ request }, use) => {
    await use(new StoreClient(request));
  },
});

export { expect };
