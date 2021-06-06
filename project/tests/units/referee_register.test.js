const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);


async function registerTest(userName, Firstname, Lastname, Country, Password, Email, Url, Status){
    const res = await request(app)
        .post('/Register')
        .send({
            username: userName,
            FirstName: Firstname,
            LastName: Lastname,
            country: Country,
            password: Password,
            email: Email,
            url: Url,
            status: Status
        });
    return res;
}

// describe('Referee register is created successfully by representative', () => {
//     test('should create a new post', async () => {
//         const res = await registerTest("noa1234567", "Test", "Test", "Israel", "admin", "examddple@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
//         expect(res.statusCode).toEqual(201);
//     })
// })

describe('Referee register is created successfully by representative', () => {
    test('should create a new post', async () => {
        const res = await registerTest("noa123", "Test", "Test", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        expect(res.statusCode).toEqual(409);
    })
})

exports.registerTest = registerTest;
