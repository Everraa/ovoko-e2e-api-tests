import { fakerEN_US as faker } from '@faker-js/faker';

export type ShippingAddress = {
  country: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
};

const VALID_US_ADDRESSES = [
  {
    streetAddress: '528 W 28th St',
    city: 'New York',
    state: 'New York',
    zipCode: '10001',
  },
  {
    streetAddress: '2118 W Chicago Ave',
    city: 'Chicago',
    state: 'Illinois',
    zipCode: '60622',
  },
  {
    streetAddress: '2800 Travis St',
    city: 'Houston',
    state: 'Texas',
    zipCode: '77006',
  },
  {
    streetAddress: '1500 Market St',
    city: 'Philadelphia',
    state: 'Pennsylvania',
    zipCode: '19102',
  },
  {
    streetAddress: '1215 4th Ave',
    city: 'Seattle',
    state: 'Washington',
    zipCode: '98101',
  },
] as const;

export function generateShippingAddress(): ShippingAddress {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const address = faker.helpers.arrayElement(VALID_US_ADDRESSES);

  return {
    country: 'United States',
    firstName,
    lastName,
    streetAddress: address.streetAddress,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    phone: faker.phone.number({ style: 'national' }),
    email: faker.internet.email({ firstName, lastName }),
  };
}
