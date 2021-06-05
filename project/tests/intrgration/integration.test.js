const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);

describe('Register and Login is created successfully', () => {
    test('should create a new post', async () => {
        const regis = await request(app)
            .post('/Register')
            .send({
                username: "adi123",
                FirstName: "Elon",
                LastName: "Musk",
                country: "Israel",
                password: "shiba@inu3",
                email: "example@gmail.com",
                url: "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg",
                status: "judge"
            })
        const res = await request(app)
            .post('/Login')
            .send({
                username: "adi123",
                password: "shiba@inu3"
            });
        expect(res.statusCode).toEqual(200)
    })
})

describe('Register and Login is created successfully', () => {
    test('should create a new post', async () => {
        const login = await request(app)
            .post('/Login')
            .send({
                username: "adi123",
                password: "shiba@inu3"
            });
        const res = await request(app)
            .post('/Logout');
        expect(res.statusCode).toEqual(200)
        expect(res.body.message).toEqual("logout succeeded")
    })
})




