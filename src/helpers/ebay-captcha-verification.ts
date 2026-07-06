import type { Page } from '@playwright/test';

const VERIFICATION_HEADING = /Please verify yourself to continue/i;
const MANUAL_VERIFICATION_TIMEOUT_MS = 300_000;

export async function waitForVerificationIfNeeded(page: Page): Promise<void> {
  const heading = page.getByRole('heading', { name: VERIFICATION_HEADING });

  if (!(await heading.isVisible().catch(() => false))) {
    return;
  }

  await heading.waitFor({ state: 'hidden', timeout: MANUAL_VERIFICATION_TIMEOUT_MS });
  await page.waitForLoadState('domcontentloaded').catch(() => undefined);
}
