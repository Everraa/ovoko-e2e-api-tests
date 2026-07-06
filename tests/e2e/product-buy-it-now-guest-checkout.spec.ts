import path from 'node:path';
import { test, expect } from '@fixtures/test.fixtures';
import { generatePaymentDetails } from '@helpers/generate-payment-details';
import { generateShippingAddress } from '@helpers/generate-shipping-address';
import { readCsv } from '@helpers/read-csv';

const testData = readCsv<{ itemId: string }>(
  path.join(process.cwd(), 'test-data', 'product-data.csv'),
)[0];

test.describe('Checkout', () => {
  test('should complete guest checkout through shipping and visa card payment details', async ({
    pom,
  }) => {
    const shippingAddress = generateShippingAddress();
    const paymentDetails = generatePaymentDetails(shippingAddress);

    await pom.productPage.openProductPage(testData.itemId);
    await expect(pom.productPage.buyItNowButton).toBeVisible();
    await pom.productPage.clickBuyItNowButton();
    await pom.checkoutPage.clickContinueAsGuest();

    await expect(pom.checkoutPage.emailInput).toBeVisible();

    await pom.checkoutPage.fillShippingAddress(shippingAddress);

    await expect(pom.checkoutPage.firstNameInput).toHaveValue(shippingAddress.firstName);
    await expect(pom.checkoutPage.lastNameInput).toHaveValue(shippingAddress.lastName);

    await pom.checkoutPage.clickSaveShippingAddress();

    await expect(pom.checkoutPage.addNewCardRadio).toBeEnabled();

    await pom.checkoutPage.selectAddNewCardRadio();
    await expect(pom.checkoutPage.cardNumberInput).toBeVisible();
    await pom.checkoutPage.fillPaymentCard(paymentDetails);
    await pom.checkoutPage.clickSavePaymentDetails();

    await expect(pom.checkoutPage.savedCardLastFourDigits).toBeVisible();

    await expect(pom.currencySelectionModal.heading).toBeVisible();
    await pom.currencySelectionModal.clickContinueInCad();
    await expect(pom.checkoutPage.savedCardLastFourDigits).toHaveText(
      `x-${paymentDetails.cardNumber.slice(-4)}`,
    );
    await expect(pom.currencySelectionModal.dialog).toBeHidden();
  });
});
