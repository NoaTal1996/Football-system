const app = require('../../main');
let session = require('supertest-session');
jest.setTimeout(100000);

let sessionTest = null;

beforeEach(function(){
    sessionTest = session(app);
});

async function logoutTest(){
    const res = await sessionTest
    .post('/Logout')
    return res;
}

//test for sucssues logout
describe("logout tests", () => {
    test('Login and then logout', async () => {
        await sessionTest.post("/Login").send({
            username: 'admdddin',
            password: 'admin'
        });
        const res = await logoutTest();
        expect(res.statusCode).toEqual(200);
    });
})

exports.logoutTest = logoutTest;