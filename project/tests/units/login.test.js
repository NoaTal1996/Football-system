const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);
describe('sum', () => {
  test('1+1', () => {
    expect(1+1).toBe(2);
  })
})

//test for usually login
describe('should login user', () => {
    test('should create a new post', async () => {
      const res = await request(app)
        .post('/Login')
        .send({
          username: "roi",
          password: "shiba@inu3"
        });
      expect(res.statusCode).toEqual(200)
    })
  })

//test for incorect username
describe("shouldn't login user", () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/Login')
        .send({
          "username": "Elon",
          "password": "shiba@inu3"
        })
      expect(res.statusCode).toEqual(401)
    })
  })

//test for incorect password
describe("shouldn't login user", () => {
  it('should create a new post', async () => {
    const res = await request(app)
      .post('/Login')
      .send({
        "username": "roi",
        "password": "shiba@i"
      })
    expect(res.statusCode).toEqual(401)
  })
})

//test for login twice
describe('should login user"', () => {
    it('should create a new post', async () => {
      const res = await request(app)
        .post('/Login')
        .send({
          "username": "roi",
          "password": 'shiba@inu3'
        })
      expect(res.statusCode).toEqual(406)
    })
  })