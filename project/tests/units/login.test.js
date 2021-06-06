const app = require('../../main');
const request = require('supertest');
let session = require('supertest-session');
jest.setTimeout(100000);

let sessionTest = null;

beforeEach(function(){
    sessionTest = session(app);
}); 


async function loginTest(userName, Password){
    const res = await request(app)
        .post('/Login')
        .send({
            username: userName,
            password: Password
        });
    return res;
}

//test for usually login
describe('login tests', () => {
    test('test for usually login', async () => {
      const res = await loginTest("noa123", "shiba@inu3");
      expect(res.statusCode).toEqual(200);
    });
    test('test for incorect username', async () => {
        const res = await loginTest("noa12","shiba@inu3")
        expect(res.statusCode).toEqual(401)
    });
    test('test for incorect password', async () => {
        const res = await loginTest("noa123","1234")
        expect(res.statusCode).toEqual(401)
    });
});

exports.loginTest = loginTest;