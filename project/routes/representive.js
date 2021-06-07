var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");

const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils")
const representive_utils = require("./utils/representive_utils")
const users = require("./users")



router.use(async function (req, res, next) {
    if (req.session && req.session.user_status === 'rep') {
        next()
    } else {
        res.sendStatus(401);
    }
});

router.post("/addGame",async (req, res, next) =>{
    try{
        if (Object.keys(req.body).length < 6){
            throw {status : 400, message: "one argument or more are missing"}
        }
        await representive_utils.insert_game(req.body)
        res.status(201).send("success");
    }catch (error) {
        next(error);
    }


})

router.put("/addResult",async (req, res, next) =>{
    try{
        await representive_utils.add_result(req.body.result, req.body.id)
        res.status(201).send("success");
    }catch (error) {
        next(error);
    }
})

router.post("/addEventDiary", async (req, res, next)=>{
    try{
        const events = req.body.events
        if (events.length < 3){
            throw {status : 400, message: "Should be at least 3 events"}
        }
        await representive_utils.add_diary(req.body.id, events)
        res.status(201).send("Events add to the systems")
    }catch (error) {
        next(error);
    }
})

router.get("/getAllGames", async (req, res, next)=>{
    try{
        const games = await representive_utils.getAllGames()
        if (games.length === 0){
            throw {status : 204, message: "no games in the system"}
        }
        res.status(200).send(games)
    }catch (error) {
        next(error);
    }
})

router.get("/getAllReferees", async (req, res, next)=> {
    try {
        const referees = await representive_utils.getReferees()
        if (referees.length === 0) {
            throw {status: 204, message: "no referees in the system"}
        }
        res.status(200).send(referees)
    } catch (error) {
        next(error);
    }
})

router.post("/createGameSchedule",async (req, res, next)=>{
    await representive_utils.create_games_schedule(req.body.game_hours,req.body.days, req.body.start_day, req.body.end_day)
    res.status(201).send("success")
})



module.exports = router;