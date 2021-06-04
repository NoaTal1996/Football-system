var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const current_stage_utils = require("./utils/current_stage_utils")


router.get("/getStageGames",async (req,res,next)=>{
    try{
        const games = await current_stage_utils.getGames()
        if (games.future_games === undefined && games.past_games === undefined){
            throw ({status: 204, message: 'No Games In Current Stage'})
        }
        res.status(200).send(games)
    } catch (error) {
    next(error);
}
})

module.exports = router;