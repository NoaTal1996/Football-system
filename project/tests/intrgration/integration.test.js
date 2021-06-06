const app = require('../../main');
const request = require('supertest');
const ref = require('../units/referee_register.test');
const login = require('../units/login.test');
jest.setTimeout(100000);

// describe('Register and Login is created successfully', () => {
//     test('should create a new post', async () => {
//         const register = await ref.registerTest("roi123", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
//         const res = await login.loginTest("adi123","shiba@inu3");
//         expect(res.statusCode).toEqual(200)
//     })
// })

// describe('Register and Login is created successfully', () => {
//     test('should create a new post', async () => {
//         const login = await request(app)
//             .post('/Login')
//             .send({
//                 username: "adi123",
//                 password: "shiba@inu3"
//             });
//         const res = await request(app)
//             .post('/Logout');
//         expect(res.statusCode).toEqual(200)
//         expect(res.body.message).toEqual("logout succeeded")
//     })
// })




