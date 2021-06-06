const app = require('../../main');
const request = require('supertest');
const log = require('../units/login.test');

jest.setTimeout(100000);

async function addgame(gameday, gametime, Hometeam, Awayteam,Field,Referee){
    const res = await request(app)
        .post("/users/representive/addGame")
        .send({
            date:gameday,
            time:gametime,
            hometeam:Hometeam,
            awayTeam:Awayteam,
            field:Field,
            referee:Referee
        });
    return res;
}


describe('add game is created successfully', () => {
    test('should create a new post', async () => {
        const login = await log.loginTest("admin","admin");
        if(login.statusCode === 201){
            const res = await addgame("2022-05-22","20:00","Midtjylland","vejle","Parken","admin124483");
            expect(res.statusCode).toEqual(201);
        }
    })
})

exports.addgame = addgame;
