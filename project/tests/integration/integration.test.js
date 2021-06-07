const app = require('../../main');
const request = require('supertest');
let session = require('supertest-session');
const regiser = require("../units/referee_register.test");
jest.setTimeout(100000);

let sessionTest = null;

beforeEach(function(){
    sessionTest = session(app);
}); 

// await sessionTest.post("/Login").send({
//     username: 'admdddin',
//     password: 'admin'
// });

describe('Integration tests', () => {
    test('Register and Login is created successfully', async () => {
        await regiser.registerTest("1234", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        const res = await sessionTest.post("/Login").send({
            username: '1234',
            password: 'shiba@inu3'
        });
        expect(res.statusCode).toEqual(200);
    });
    test('Register and Login with wrong password', async () => {
        await regiser.registerTest("1234", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        const res = await sessionTest.post("/Login").send({
            username: '1234',
            password: '134'
        });
        expect(res.statusCode).toEqual(401);
    });
    test("Login and Login again with the same username", async () => {
        await sessionTest.post("/Login").send({
            username: '1234',
            password: 'shiba@inu3'
        });
        const res = await sessionTest.post("/Login").send({
            username: '1234',
            password: 'shiba@inu3'
        });
        expect(res.statusCode).toEqual(406)
    });
});


// describe("Login and couldn't Login again with the same username", () => {
//     test('should create a new post', async () => {
//         const user = await log.loginTest("roi84222340067","shiba@inu3");
//         if(user.statusCode === 200){
//             const res = await log.loginTest("roi84222340067","shiba@inu3");
//             expect(res.statusCode).toEqual(406)
//         }
//     })
// })
