const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);


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
describe('should login user', () => {
    test('should create a new post', async () => {
      const res = await loginTest("noa123", "shiba@inu3")
      expect(res.statusCode).toEqual(200)
    })
  })

//test for incorect username
describe("shouldn't login user", () => {
    test('should create a new post', async () => {
      const res = await loginTest("noa12","shiba@inu3")
      expect(res.statusCode).toEqual(401)
    })
  })

//test for incorect password
describe("shouldn't login user", () => {
    test('should create a new post', async () => {
        const res = await loginTest("noa123","1234")
        expect(res.statusCode).toEqual(401)
    })
})

exports.loginTest = loginTest;
