import { faker } from '@faker-js/faker'

function createRandomUser() {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ max: 60, min: 21}),
    gender: faker.person.gender(),
    country: faker.location.country()
  }

  return user
}

