import { TestStep } from '@helpers/test-step';
import { ModalObject } from '@pages/modal-object';

export class CurrencySelectionModal extends ModalObject {
  get heading() {
    return this.dialog.getByRole('heading', { name: /Select a currency for this purchase/i });
  }

  get continueInCadButton() {
    return this.dialog.getByRole('button', { name: /Continue in CAD/i });
  }

  @TestStep
  async clickContinueInCad() {
    await this.continueInCadButton.click();
  }
}
