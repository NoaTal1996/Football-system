const app = require('../../main');
const request = require('supertest');
const login = require('./login.test');
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
        })
        return res
}

describe('add game is created successfully', () => {
    test('should create a new post', async () => {
        const log = await login.loginTest("admin","admin");
        if(log.statusCode.toEqual(200)){
            const res = await addgame("2022-05-22","20:00","Midtjylland","vejle","Parken","ElonMusk");
            expect(res.statusCode).toEqual(201);
        }
    })
})


exports.addgame = addgame;
