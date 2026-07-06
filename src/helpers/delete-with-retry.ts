import type { APIResponse } from '@playwright/test';

type DeleteWithRetryOptions = {
  retries?: number;
  delayMs?: number;
};

export async function deleteWithRetry(
  deleteFn: () => Promise<APIResponse>,
  { retries = 3, delayMs = 500 }: DeleteWithRetryOptions = {},
): Promise<APIResponse> {
  let lastResponse: APIResponse | undefined;

  for (let attempt = 1; attempt <= retries; attempt++) {
    lastResponse = await deleteFn();

    if (lastResponse.ok() || lastResponse.status() === 404) {
      return lastResponse;
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw new Error(
    `DELETE failed after ${retries} attempts (last status: ${lastResponse?.status() ?? 'unknown'})`,
  );
}
