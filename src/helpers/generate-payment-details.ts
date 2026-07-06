import { fakerEN_US as faker } from '@faker-js/faker';
import type { ShippingAddress } from '@helpers/generate-shipping-address';

export type PaymentDetails = {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
};

const VALID_VISA_TEST_CARD_NUMBERS = ['4242424242424242'] as const;

export function generatePaymentDetails(
  shippingAddress: Pick<ShippingAddress, 'firstName' | 'lastName'>,
): PaymentDetails {
  const expirationMonth = faker.number.int({ min: 1, max: 12 });
  const expirationYear = faker.number.int({
    min: new Date().getFullYear() + 1,
    max: new Date().getFullYear() + 8,
  });

  return {
    firstName: shippingAddress.firstName,
    lastName: shippingAddress.lastName,
    cardNumber: faker.helpers.arrayElement(VALID_VISA_TEST_CARD_NUMBERS),
    expirationDate: `${String(expirationMonth).padStart(2, '0')}/${String(expirationYear).slice(-2)}`,
    securityCode: faker.finance.creditCardCVV(),
  };
}
