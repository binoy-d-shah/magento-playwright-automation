import { faker } from '@faker-js/faker';

export const generateRandomUser = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({length: 20})
});

export const generateRandomGuestUser = () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: 'Alaska',
    postcode: '12345',
    phoneNumber: faker.phone.number({ style: 'international' })
});
