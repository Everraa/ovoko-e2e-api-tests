import type { Page } from '@playwright/test';
import { PageObject } from '@pages/page-object';

type PageObjectConstructor<T extends PageObject> = new (page: Page) => T;

export class PageObjectCache {
  private readonly pageObjects = new Map<string, PageObject>();

  constructor(private readonly page: Page) {}

  protected getPageObject<T extends PageObject>(PageObjectClass: PageObjectConstructor<T>): T {
    const key = PageObjectClass.name;

    if (!this.pageObjects.has(key)) {
      this.pageObjects.set(key, new PageObjectClass(this.page));
    }

    return this.pageObjects.get(key)! as T;
  }
}
