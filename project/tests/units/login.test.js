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

async function logoutTest(){
  const res = await request(app)
  .post('/Logout')
  return res;
}

//test for usually login
describe('should login user', () => {
    test('should create a new post', async () => {
      const res = await loginTest("AL", "shiba@inu3")
      expect(res.statusCode).toEqual(200)
    })
  })

//test for incorect username
describe("shouldn't login user", () => {
    test('should create a new post', async () => {
      const res = await loginTest("Elon","1234")
      expect(res.statusCode).toEqual(401)
    })
  })

//test for incorect password
describe("shouldn't login user", () => {
  test('should create a new post', async () => {
    const res = await loginTest("roi", "shiba@i")
    expect(res.statusCode).toEqual(401)
  })
})

//test for sucssues logout
describe("should logout user", () => {
  test('should create a new post', async () => {
    const res = await logoutTest()
    expect(res.statusCode).toEqual(200)
  })
})

exports.loginTest = loginTest;
