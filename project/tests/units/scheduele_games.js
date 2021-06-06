const app = require('../../main');
const request = require('supertest')
jest.setTimeout(100000);

async function addgame(gameday, gametime, hometeam, awayteam,field,game_Id,referee){
    const res = await request(app)
        .post("/users/representive/addGame")
        .send({
            GameDay:gameday,
            GameTime:gametime,
            HomeTeam:hometeam,
            AwayTeam:awayteam,
            Field:field,
            Game_Id:game_Id,
            Referee:referee
        })
        return res
}

describe('Referee register is created successfully', () => {
    test('should create a new post', async () => {
        const res = await registerTest("AL", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        expect(res.statusCode).toEqual(201);
    })
})


exports.addgame = addgame;
