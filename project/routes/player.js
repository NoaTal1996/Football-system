let express = require("express");
let router = express.Router();
const players_utils = require("./utils/players_utils");

router.get("/player_info/:PLAYER_ID", async (req, res, next)=>{
    try{
        let player_id = req.params.PLAYER_ID
        if (!player_id){
            throw {status : 404, message: "player not found"}
        }
        const player_res = await players_utils.getPlayerById(player_id);
        if (player_res.status === 404){
            throw {status : 404, message: "player not found"};
        }
        res.status(200).send(player_res);
    }
    catch (error){
        next (error)
    }
})



module.exports = router;