let express = require("express");
let router = express.Router();
const users_utils = require("./utils/users_utils");
const coach_utils = require("./utils/coach_utils");

router.get("/coach_info/:COACH_ID", async (req, res, next)=>{
    try{
        let coach_id = req.params.COACH_ID
        if (!coach_id){
            throw {status : 404, message: "coach not found"}
        }
        const coach_res = await coach_utils.getCoachById(coach_id);
        if (coach_res.status === 404){
            throw {status : 404, message: "coach not found"};
        }
        res.status(200).send(coach_res);

    }
    catch (error){
        next (error)
    }
})

module.exports = router;