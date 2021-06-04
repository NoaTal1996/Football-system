var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const coach_utils = require("./utils/coach_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const id = req.params.teamId
    const player_details = await players_utils.getPlayersByTeam(
        id
    );
    if (!player_details){
        throw {status : 404, message: "team not found"}
    }
    //we should keep implementing team page.....
    const coach_details = await coach_utils.getCoachByTeam(
        id
    );
    const games_details = await get_team_games(id)
    const result = {
      players: player_details,
      coach: coach_details,
      future_games: games_details.future_games,
      past_games: games_details.past_games
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
});


async function get_team_games(team_id) {
  const past_games = await DButils.execQuery(
      `SELECT * FROM Games WHERE (HomeTeam='${team_id}' OR AwayTeam='${team_id}') AND GameResult is not NULL ORDER BY GameDay DESC, GameTime DESC`
  );
  let p_games = []
  for (let i = 0; i < past_games.length; i++){
    let gid = past_games[i].Game_Id
    let events = await DButils.execQuery(
        `SELECT * FROM Events WHERE Game_Id='${gid}'`
    );
    p_games.push({game: past_games[i],events: events})
  }
  const future_games = await DButils.execQuery(
      `SELECT GameDay,GameTime,HomeTeam,AwayTeam,Field,Game_Id FROM Games WHERE (HomeTeam='${team_id}' OR AwayTeam='${team_id}') AND GameResult is NULL ORDER BY GameDay ASC, GameTime ASC`
  );

  return {
    past_games: p_games,
    future_games: future_games
  }
}

module.exports = router;
