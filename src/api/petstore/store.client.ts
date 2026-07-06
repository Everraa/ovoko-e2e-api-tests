import type { APIRequestContext, APIResponse } from '@playwright/test';
import { deleteWithRetry } from '@helpers/delete-with-retry';
import type { Order } from './types';

export class StoreClient {
  constructor(private readonly request: APIRequestContext) {}

  placeOrder(order: Order): Promise<APIResponse> {
    return this.request.post('store/order', { data: order });
  }

  getOrder(orderId: number): Promise<APIResponse> {
    return this.request.get(`store/order/${orderId}`);
  }

  deleteOrder(orderId: number): Promise<APIResponse> {
    return deleteWithRetry(() => this.request.delete(`store/order/${orderId}`));
  }
}
