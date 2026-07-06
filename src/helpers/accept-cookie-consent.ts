import type { Page } from '@playwright/test';

const COOKIE_BANNER_PATTERN = /cookies and similar technologies|To personalize your experience/i;

export async function acceptAllCookiesIfVisible(page: Page): Promise<void> {
  const acceptAllButton = page.getByRole('button', { name: /accept all/i });

  if (!(await acceptAllButton.isVisible().catch(() => false))) {
    return;
  }

  const banner = page.locator('section, div').filter({ hasText: COOKIE_BANNER_PATTERN }).last();

  await acceptAllButton.click();
  await banner.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => undefined);
}
