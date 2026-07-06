import { ebayApiPaths } from '@config/ebay-api-paths';
import { acceptAllCookiesIfVisible } from '@helpers/accept-cookie-consent';
import { TestStep } from '@helpers/test-step';
import type { PaymentDetails } from '@helpers/generate-payment-details';
import type { ShippingAddress } from '@helpers/generate-shipping-address';
import { PageObject } from '@pages/page-object';

export class CheckoutPage extends PageObject {
  get shippingSection() {
    return this.page.getByTestId('SHIPPING');
  }

  get paymentMethodsSection() {
    return this.page.getByTestId('PAYMENT_METHODS');
  }

  get guestCheckoutLink() {
    return this.page.getByRole('link', { name: 'Check out as guest' });
  }

  get emailInput() {
    return this.shippingSection.getByRole('textbox', { name: 'Email', exact: true });
  }

  get countrySelect() {
    return this.shippingSection.getByRole('combobox', { name: 'Country or region' });
  }

  get firstNameInput() {
    return this.shippingSection.getByRole('textbox', { name: 'First name', exact: true });
  }

  get lastNameInput() {
    return this.shippingSection.getByRole('textbox', { name: 'Last name', exact: true });
  }

  get streetAddressInput() {
    return this.shippingSection.getByRole('textbox', { name: 'Street address', exact: true });
  }

  get cityInput() {
    return this.shippingSection.getByRole('textbox', { name: 'City', exact: true });
  }

  get stateSelect() {
    return this.shippingSection.getByRole('combobox', { name: 'State/Province/Region' });
  }

  get zipCodeInput() {
    return this.shippingSection.getByRole('textbox', { name: 'ZIP code' });
  }

  get phoneInput() {
    return this.shippingSection.getByRole('textbox', { name: 'Phone number' });
  }

  get saveShippingButton() {
    return this.shippingSection.getByRole('button', { name: 'Done', exact: true });
  }

  get addNewCardRadio() {
    return this.paymentMethodsSection.getByRole('radio', { name: 'Add new card' });
  }

  get cardholderFirstNameInput() {
    return this.paymentMethodsSection.getByRole('textbox', { name: 'First name', exact: true });
  }

  get cardholderLastNameInput() {
    return this.paymentMethodsSection.getByRole('textbox', { name: 'Last name', exact: true });
  }

  get cardNumberInput() {
    return this.paymentMethodsSection.getByRole('textbox', { name: 'Card number' });
  }

  get expirationDateInput() {
    return this.paymentMethodsSection.getByRole('textbox', { name: 'Expiration date' });
  }

  get securityCodeInput() {
    return this.paymentMethodsSection.getByRole('textbox', { name: 'Security code', exact: true });
  }

  get savePaymentButton() {
    return this.paymentMethodsSection.getByRole('button', { name: 'Done', exact: true });
  }

  get savedCardLastFourDigits() {
    return this.paymentMethodsSection.getByText(/^x-\d{4}$/);
  }

  @TestStep
  async clickContinueAsGuest() {
    await this.guestCheckoutLink.click();
    await this.afterNavigation();
    await acceptAllCookiesIfVisible(this.page);
  }

  @TestStep
  async selectCountry(country: string) {
    await this.performActionAndWaitForResponse(async () => {
      await this.countrySelect.selectOption(country);
    }, ebayApiPaths.getAddressFields);
    await this.stateSelect.waitFor({ state: 'visible' });
  }

  @TestStep
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  @TestStep
  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  @TestStep
  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  @TestStep
  async fillStreetAddress(streetAddress: string) {
    await this.streetAddressInput.fill(streetAddress);
  }

  @TestStep
  async fillCity(city: string) {
    await this.cityInput.fill(city);
  }

  @TestStep
  async fillZipCode(zipCode: string) {
    await this.zipCodeInput.fill(zipCode);
  }

  @TestStep
  async fillPhone(phone: string) {
    await this.phoneInput.fill(phone.replace(/\D/g, ''));
  }

  @TestStep
  async selectState(state: string) {
    await this.stateSelect.selectOption(state);
  }

  @TestStep
  async fillShippingAddress(address: ShippingAddress) {
    await this.fillEmail(address.email);
    await this.selectCountry(address.country);
    await this.fillStreetAddress(address.streetAddress);
    await this.fillCity(address.city);
    await this.selectState(address.state);
    await this.fillZipCode(address.zipCode);
    await this.fillPhone(address.phone);
    await this.fillFirstName(address.firstName);
    await this.fillLastName(address.lastName);
  }

  @TestStep
  async clickSaveShippingAddress() {
    await this.saveShippingButton.click();
  }

  @TestStep
  async selectAddNewCardRadio() {
    await this.addNewCardRadio.check();
  }

  @TestStep
  async fillPaymentCard(card: PaymentDetails) {
    await this.cardNumberInput.fill(card.cardNumber);
    await this.expirationDateInput.fill(card.expirationDate);
    await this.securityCodeInput.fill(card.securityCode);
    await this.cardholderFirstNameInput.fill(card.firstName);
    await this.cardholderLastNameInput.fill(card.lastName);
  }

  @TestStep
  async clickSavePaymentDetails() {
    await this.savePaymentButton.click();
  }
}
