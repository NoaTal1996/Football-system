const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);

async function addgame(){
const res = await request(app)
    .post()
}

