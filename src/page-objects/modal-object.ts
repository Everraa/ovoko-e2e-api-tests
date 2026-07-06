import { PageObject } from '@pages/page-object';

export abstract class ModalObject extends PageObject {
  get dialog() {
    return this.page.getByRole('dialog');
  }
}
