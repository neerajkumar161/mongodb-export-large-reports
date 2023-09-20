import { faker } from '@faker-js/faker'
import { createWriteStream } from 'node:fs'

const FILE_NAME = 'database.csv'

const fileWriteStream = createWriteStream(FILE_NAME)

function createRandomUser() {
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ max: 60, min: 21}),
    gender: faker.person.gender(),
    country: faker.location.country()
  }

  return `${user.firstName},${user.lastName},${user.age},${user.gender},${user.country}`
  
}

console.time('write')
for (let i = 0; i < 1e4; i++) {  // 10.000
  fileWriteStream.write(`${createRandomUser()}\n`)
}

fileWriteStream.end()
console.timeEnd('write')
