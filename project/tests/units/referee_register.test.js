const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);
const login = require('./login.test');

async function registerTest(userName, Firstname, Lastname, Country, Password, Email, Url, Status){
  const res = await request(app)
        .post('/Register')
        .send({
          username: userName,
          FirstName: Firstname,
          LastName: Lastname,
          country: Country,
          password: Password,
          email: Email,
          url: Url,
          status: Status
        });
  return res;
}

describe('Referee register is created successfully by representative', () => {
  test('should create a new post', async () => {
    const logRep = await login.loginTest('admin', 'admin');
    if(logRep.statusCode.toEqual(200)){
      const res = await registerTest("Test", "Test", "Test", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
      expect(res.statusCode).toEqual(201);
    }
  })
})

describe('Referee register is not created beacuse representative is not login', () => {
  test('should create a new post', async () => {
    const logRep = await login.loginTest('admin', '1234'); //fail in the login
    if(logRep.statusCode.toEqual(200)){
      const res = await registerTest("Test", "Test", "Test", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
      expect(res.statusCode).toEqual(201);
    }
  })
})

// describe('Referee register is not created successfully beacuse the user is not rep', () => {
//   test('should create a new post', async () => {
//     const logRep = await login.loginTest('Amit', '1234');
//     if(logRep.statusCode.toEqual(200)){
//       const res = await registerTest("Test", "Test", "Test", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
//       expect(res.statusCode).toEqual(201);
//     }
//   })
// })


describe('Referee register by representative but username taken', () => {
  test('should create a new post', async () => {
    const logRep = await login.loginTest('admin', 'admin');
    if(logRep.statusCode.toEqual(200)){
      const res = await registerTest("Test", "Test", "Test", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
      expect(res.statusCode).toEqual(409);
    }
  })
})


exports.registerTest = registerTest;
