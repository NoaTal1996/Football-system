const app = require('../../main');
let session = require('supertest-session');
const representive_utils = require("../../routes/utils/representive_utils");
const DButils = require("../../routes/utils/DButils");
jest.setTimeout(100000);

let sessionTest = null;
beforeEach(function(){
    sessionTest = session(app);
});

// async function addgame(gameday, gametime, Hometeam, Awayteam, Field, Referee){
//     const res = await sessionTest
//         .post("/users/representive/addGame")
//         .send({
//             date: gameday,
//             time: gametime,
//             hometeam: Hometeam,
//             awayteam: Awayteam,
//             field: Field,
//             referee: Referee
//         });
//     return res;
// }

describe('schedule games', () => {
    test('check insert_game function', async () => {
        body = {
            date: "2022-05-22",
            time: "20:00",
            hometeam: "Midtjylland",
            awayteam: "vejle",
            field: "Parken",
            referee: "noa123"
        };
        await representive_utils.insert_game(body);
        const res =  await DButils.execQuery(
            `SELECT * FROM Games
            WHERE GameDay = '2022-05-22' and GameTime = '20:00'
            and field = 'Parken' and referee = 'noa123'`);
        console.log(res);
        expect(res.length).toBe(1);
    });
});

