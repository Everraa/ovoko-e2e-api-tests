import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '@config/env';
import { deleteWithRetry } from '@helpers/delete-with-retry';
import type { Pet } from './types';

export class PetClient {
  constructor(private readonly request: APIRequestContext) {}

  createPet(pet: Pet): Promise<APIResponse> {
    return this.request.post('pet', { data: pet });
  }

  getPet(petId: number): Promise<APIResponse> {
    return this.request.get(`pet/${petId}`);
  }

  deletePet(petId: number): Promise<APIResponse> {
    return deleteWithRetry(() =>
      this.request.delete(`pet/${petId}`, {
        headers: { api_key: env.API_KEY },
      }),
    );
  }
}
