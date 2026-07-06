import { TestStep } from '@helpers/test-step';
import { ModalObject } from '@pages/modal-object';

export class AddedToCartModal extends ModalObject {
  get heading() {
    return this.dialog.getByRole('heading', { name: /Added to cart/i });
  }

  get seeInCartLink() {
    return this.dialog.getByRole('link', { name: /See in cart/i });
  }

  @TestStep
  async clickSeeInCart() {
    await this.seeInCartLink.click();
    await this.afterNavigation();
  }
}
