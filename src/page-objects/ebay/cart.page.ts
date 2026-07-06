import { TestStep } from '@helpers/test-step';
import { PageObject } from '@pages/page-object';

export class CartPage extends PageObject {
  get checkoutButton() {
    return this.page.getByRole('button', { name: /Go to checkout/i });
  }

  get removeItemButton() {
    return this.page.getByRole('button', { name: /^Remove/i }).first();
  }

  get emptyCartMessage() {
    return this.page.getByText(
      /You don't have any items in your cart|Your shopping cart is empty/i,
    );
  }

  @TestStep
  async clickRemoveFirstItem() {
    await this.removeItemButton.click();
  }
}
