const app = require('../../main');
const request = require('supertest');
let session = require('supertest-session');
const regiser = require("../units/referee_register.test");
jest.setTimeout(300000);

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

describe('Integration tests', () => {
    test('Register and Login is created successfully', async () => {
        await regiser.registerTest("1234", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        const res = await sessionTest.post("/Login").send({
            username: '1234',
            password: 'shiba@inu3'
        });
        expect(res.statusCode).toEqual(200);
    });
    test('Register and Login with wrong password', async () => {
        await regiser.registerTest("1234", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        const res = await sessionTest.post("/Login").send({
            username: '1234',
            password: '134'
        });
        expect(res.statusCode).toEqual(401);
    });
    test("Login and Login again with the same username", async () => {
        await sessionTest.post("/Login").send({
            username: '1234',
            password: 'shiba@inu3'
        });
        const res = await sessionTest.post("/Login").send({
            username: '1234',
            password: 'shiba@inu3'
        });
        expect(res.statusCode).toEqual(406)
    });
    test('Register and register again with the same username', async () => {
        await regiser.registerTest("try", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        const res = await regiser.registerTest("try", "Roi", "Reinshtein", "Israel", "shiba@inu3", "example@gmail.com", "https://res.cloudinary.com/db8c94xbz/image/upload/v1620751152/shiba_kufmdi.jpg", "judge");
        expect(res.statusCode).toEqual(409);
    });
    test('add game is created successfully', async () => {
        await sessionTest.post("/Login").send({
            username: 'admin',
            password: 'admin'
        });
        const res = await addgame("2021-05-22","20:00","Midtjylland","vejle","Parken","noa123");
        expect(res.statusCode).toEqual(201);
    });
    test("add game isn't created successfully - missing values", async () => {
        await sessionTest.post("/Login").send({
            username: 'admin',
            password: 'admin'
        });
        const res = await addgame("20:00","Midtjylland","vejle","Parken","admin124483");
        expect(res.statusCode).toEqual(400);
    });
    test("add game isn't created successfully - try add with user which isn't rep", async () => {
        await sessionTest.post("/Login").send({
            username: 'admdddin',
            password: 'admin'
        });
        const res = await addgame("2022-05-22","20:00","Midtjylland","vejle","Parken","admin124483");
        expect(res.statusCode).toEqual(401);
    });
    test("add game isn't created successfully - without login by representative", async () => {
        const res = await addgame("2022-05-22","20:00","Midtjylland","vejle","Parken","admin124483");
        expect(res.statusCode).toEqual(401);
    });
    test("login as representative and add game after it", async () => {
        await sessionTest.post("/Login").send({
            username: 'admin',
            password: 'admin'
        });
        const res = await sessionTest.post("/users/representive/createGameSchedule").send(
            {
                game_hours: ["20:00", "21:30", "19:00"],
                days: ["Sunday", "Monday"],
                start_day: "2019-12-31", 
                end_day: "2020-1-10"
            }  
        );
        expect(res.statusCode).toEqual(201);
    });
});

