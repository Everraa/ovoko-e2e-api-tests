import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/api.fixtures';
import { PetClient } from '@api/petstore/pet.client';
import { StoreClient } from '@api/petstore/store.client';
import type { Order, Pet } from '@api/petstore/types';

const PET_COUNT = 4;
const ORDERS_PER_PET = 2;

test.describe.serial('Pet order lifecycle', () => {
  const createdPetIds: number[] = [];
  const createdOrderIds: number[] = [];

  test.afterAll(async ({ request }) => {
    const petClient = new PetClient(request);
    const storeClient = new StoreClient(request);

    for (const orderId of [...createdOrderIds].reverse()) {
      await storeClient.deleteOrder(orderId).catch(() => undefined);
    }

    for (const petId of [...createdPetIds].reverse()) {
      await petClient.deletePet(petId).catch(() => undefined);
    }
  });

  test('should create 4 pets with status available', async ({ petClient }) => {
    const baseId = Date.now();

    for (let index = 0; index < PET_COUNT; index++) {
      const pet: Pet = {
        id: baseId + index,
        name: faker.animal.petName(),
        photoUrls: [faker.image.url()],
        status: 'available',
      };

      const response = await test.step(`Create pet ${index + 1}`, () => petClient.createPet(pet));

      expect(response.ok(), `create pet response: ${response.status()}`).toBeTruthy();

      const body = (await response.json()) as Pet;
      expect(body.status).toBe('available');
      expect(body.id).toBeDefined();

      createdPetIds.push(body.id!);
    }

    expect(createdPetIds).toHaveLength(PET_COUNT);
  });

  test('should place multiple orders for each created pet', async ({ storeClient }) => {
    expect(createdPetIds.length).toBe(PET_COUNT);

    for (const petId of createdPetIds) {
      for (let orderIndex = 0; orderIndex < ORDERS_PER_PET; orderIndex++) {
        const order: Order = {
          petId,
          quantity: orderIndex + 1,
          status: 'placed',
        };

        const response = await test.step(`Place order for pet ${petId}`, () =>
          storeClient.placeOrder(order),
        );

        expect(response.ok(), `place order response: ${response.status()}`).toBeTruthy();

        const body = (await response.json()) as Order;
        expect(body.petId).toBe(petId);
        expect(body.id).toBeDefined();

        createdOrderIds.push(body.id!);
      }
    }

    expect(createdOrderIds).toHaveLength(PET_COUNT * ORDERS_PER_PET);
  });

  test('should delete all created orders', async ({ storeClient }) => {
    expect(createdOrderIds.length).toBeGreaterThan(0);

    for (const orderId of createdOrderIds) {
      const response = await test.step(`Delete order ${orderId}`, () =>
        storeClient.deleteOrder(orderId),
      );

      expect(response.ok() || response.status() === 404).toBeTruthy();
    }
  });

  test('should delete all created pets', async ({ petClient }) => {
    expect(createdPetIds.length).toBe(PET_COUNT);

    for (const petId of createdPetIds) {
      const response = await test.step(`Delete pet ${petId}`, () => petClient.deletePet(petId));

      expect(response.ok() || response.status() === 404).toBeTruthy();
    }
  });

  test('should return 404 when retrieving deleted resources', async ({ petClient, storeClient }) => {
    for (const orderId of createdOrderIds) {
      const response = await test.step(`Verify deleted order ${orderId} returns 404`, () =>
        storeClient.getOrder(orderId),
      );

      expect(response.status()).toBe(404);
    }

    for (const petId of createdPetIds) {
      const response = await test.step(`Verify deleted pet ${petId} returns 404`, () =>
        petClient.getPet(petId),
      );

      expect(response.status()).toBe(404);
    }
  });
});

/*
 * Additional test cases (not automated):
 *
 * Pet
 * - Create pet without required fields (name, photoUrls) → 405/400
 * - Update pet status available → sold and verify via GET /pet/findByStatus
 * - GET /pet/{petId} with invalid ID (non-numeric, negative) → 400
 * - DELETE /pet/{petId} without api_key header → unauthorized response
 *
 * Orders
 * - Place order for non-existent petId → error
 * - Order with quantity 0 or negative → 400
 * - GET /store/order/{orderId} for ID > 10
 * - Delete the same order twice → 404 on second attempt
 */