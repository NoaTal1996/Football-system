const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);


describe('Referee register is created successfully', () => {
  test('should create a new post', async () => {
    const res = await request(app)
      .post('/Register')
      .send({
        username: "roi",
        FirstName: "Elon",
        LastName: "Musk",
        country: "Israel",
        password: "shiba@inu3",
        email: "example@gmail.com",
        url: "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg",
        status: "judge"
      });
    expect(res.statusCode).toEqual(201)
  })
})

describe('Username Taken', () => {
  test('should create a new post', async () => {
    const res = await request(app)
      .post('/Register')
      .send({
        username: "roi",
        FirstName: "Elon",
        LastName: "Musk",
        country: "Israel",
        password: "shiba@inu3",
        email: "example@gmail.com",
        url: "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg",
        status: "judge"
      });
    expect(res.statusCode).toEqual(409)
  })
})

