const players_utils = require("./utils/players_utils");
const coach_utils = require("./utils/coach_utils");
const teams_utils = require("./utils/teams_utils")
const DButils = require("./utils/DButils")
let express = require("express");
let router = express.Router();


router.get("/search_query/:NAME", async (req, res, next)=>{
    try{
        let players = await players_utils.getPlayerByName(req.params.NAME)
        let teams = await teams_utils.getTeamsByName(req.params.NAME)
        let coach = await coach_utils.getCoachByName(req.params.NAME)
        if (players.length === 0 && teams.length === 0 && coach.length === 0){
            throw {status : 204, message: "no results found"}
        }
        const search_res = {
            players: players,
            coach: coach,
            teams: teams
        }
        if (req.session && req.session.user_id){
            req.session.last_search_query = {query: req.params.NAME, position: undefined, team: undefined}
            req.session.last_search_res = search_res
        }
        res.status(200).send(search_res);
    }
    catch (error){
        next(error)
    }
})

router.get("/search_query/:NAME/:POSITION", async (req, res, next)=>{
    try{
        let players = await players_utils.getPlayerByName(req.params.NAME)
        let isnum = /^\d+$/.test(req.params.POSITION);
        if (!isnum){
            return next()
        }
        let position = Number(req.params.POSITION)
        players = players.filter((player)=>{
            return player.position === position
        })
        if (players.length === 0)
            throw {status : 204, message: "no results found"}
        if (req.session && req.session.user_id){
            req.session.last_search_query = {query: req.params.NAME, position: req.params.POSITION, team: undefined}
            req.session.last_search_res = players
        }
        res.status(200).send(players);
    }catch (error){
        next(error)
    }
})

router.get("/search_query/:NAME/:TEAM",  async (req, res, next)=>{
    try{
        let players = await players_utils.getPlayerByName(req.params.NAME)
        let coaches = await coach_utils.getCoachByName(req.params.NAME)
        players = players.filter((player)=>{
            return player.Team_name === req.params.TEAM
        })
        coaches = coaches.filter((coach)=>{
            return coach.Team_name === req.params.TEAM
        })
        console.log(coaches)
        if (players.length === 0 && coaches.length === 0)
            throw {status : 204, message: "no results found"}
        if (req.session && req.session.user_id){
            req.session.last_search_query = {query: req.params.NAME, position: undefined, team: req.params.TEAM}
            req.session.last_search_res = {playres: players, coaches: coaches}
        }
        res.status(200).send({playres: players, coaches: coaches});
    }catch (error){
        next(error)
    }
})


module.exports = router;