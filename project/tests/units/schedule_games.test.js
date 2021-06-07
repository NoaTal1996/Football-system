const app = require('../../main');
let session = require('supertest-session');
const request = require('supertest')
const log = require('./login.test');
jest.setTimeout(100000);

let sessionTest = null;
beforeEach(function(){
    sessionTest = session(app);
});

async function addgame(gameday, gametime, Hometeam, Awayteam, Field, Referee){
    const res = await sessionTest
        .post("/users/representive/addGame")
        .send({
            date: gameday,
            time: gametime,
            hometeam: Hometeam,
            awayteam: Awayteam,
            field: Field,
            referee: Referee
        });
    return res;
}

describe('schedule games', () => {
    test('add game is created successfully', async () => {
        await sessionTest.post("/Login").send({
            username: 'admin',
            password: 'admin'
        });
        const res = await addgame("2022-05-22","20:00","Midtjylland","vejle","Parken","admin124483");
        expect(res.statusCode).toEqual(201);
    });
    test('add game is not created successfully - missing values', async () => {
        await sessionTest.post("/Login").send({
            username: 'admin',
            password: 'admin'
        });
        const res = await addgame("20:00","Midtjylland","vejle","Parken","admin124483");
        expect(res.statusCode).toEqual(400);
    });
    test("add game isn't created successfully - couldn't login", async () => {
        await sessionTest.post("/Login").send({
            username: 'admdddin',
            password: 'admin'
        });
        const res = await addgame("2022-05-22","20:00","Midtjylland","vejle","Parken","admin124483");
        expect(res.statusCode).toEqual(401);
    });
});

exports.addgame = addgame;