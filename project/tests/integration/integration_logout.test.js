const app = require('../../main');
let session = require('supertest-session');
let logout = require("../units/logout.test");
let register = require("../units/referee_register.test");
jest.setTimeout(300000);

let sessionTest = null;

beforeEach(function(){
    sessionTest = session(app);
}); 

describe('Integration tests for logout', () => {
    test('Register and Login and then Logout', async () => {
        await register.registerTest("4567", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        await sessionTest.post("/Login").send({
            username: '4567',
            password: 'shiba@inu3'
        });
        const res = await logout.logoutTest();
        expect(res.statusCode).toEqual(200);
    });
});