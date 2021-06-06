const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);

async function logoutTest(){
    const res = await request(app)
    .post('/Logout')
    return res;
  }

//test for sucssues logout
describe("should logout user", () => {
    test('should create a new post', async () => {
      const res = await logoutTest()
      expect(res.statusCode).toEqual(200)
    })
  })

exports.logoutTest = logoutTest;


  