const app = require('../../main');
const request = require('supertest');
const log = require('../units/login.test');
const regis = require('../units/referee_register.test');

jest.setTimeout(100000);


describe('Register and Login is created successfully', () => {
    test('should create a new post', async () => {
        const register = await regis.registerTest("roi16782223", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        if(register.statusCode == 200){
            const res = await log.loginTest("roi16782223","shiba@inu3");
            expect(res.statusCode).toEqual(200)
        }
    })
})