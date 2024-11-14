const { faker } = require('@faker-js/faker');
const prisma = require('./prisma');

function createRandomUser() {
    const sex = faker.person.sex();
    const f_name = faker.person.firstName(sex);
    const l_name = faker.person.lastName();
    const username = faker.internet.username(
        {
            firstName: f_name,
            lastName: l_name
        }
    )
    const email = faker.internet.email(
        {
            firstName: f_name,
            lastName: l_name
        }
    )
    return {
    username: username,
    hash: faker.internet.password(),
    salt: faker.internet.password(),
    email: email,
    birthday: faker.date.birthdate(),
    sex: sex,
    f_name: f_name,
    l_name: l_name,
  };
}

const users = faker.helpers.multiple(createRandomUser, {count: 10});

// console.log(users);

async function addUsers() {
    await prisma.user.createMany({
        data: users,
    })
}

// addUsers();

// async function addUsers() {
//     users.forEach(async user => {
//         await prisma.user.create
//     });
// }
