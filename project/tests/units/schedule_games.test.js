const DButils = require("../../routes/utils/DButils");
const representive_utils = require("../../routes/utils/representive_utils");
jest.setTimeout(10000000);

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
        expect(res.length).toBe(1);
    });
});

