var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils")
const representive= require("./representive")
/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT username FROM Users")
      .then((users) => {
        if (users.find((x) => x.username === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path gets body with playerId and save this player in the favorites list of the logged-in user
 */

router.post("/addFavoriteGame", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const result = await users_utils.markGameAsFavorite(user_id,req.body.id)
    if ((await users_utils.isPastGame(req.body.id))){
      throw {status:400,message: 'Cannot add to favorites past games'}
    }
    if (result === 'fail'){
      throw {status:409,message: 'Game Already in Favorites'}
    }
    res.status(200).send("success");
  } catch (error) {
    next(error);
  }
});

router.post("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const player_id = req.body.playerId;
    const res = await users_utils.markPlayerAsFavorite(user_id, player_id);
    if (res === 'fail'){
      throw {status : 409, message: "Game is Already in Favorites"}
    }
    res.status(201).send("The player successfully saved as favorite");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the favorites players that were saved by the logged-in user
 */
router.get("/favoritePlayers", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorite_players = {};
    const player_ids = await users_utils.getFavoritePlayers(user_id);
    let player_ids_array = [];
    player_ids.map((element) => player_ids_array.push(element.player_id)); //extracting the players ids into array
    const results = await players_utils.getPlayersInfo(player_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

router.get("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let favorites_games = await users_utils.getFavoriteGames(user_id)
    console.log(favorites_games)
    if (favorites_games.length === 0){
      throw {status : 204, message: "no results found"}
    }
    res.status(200).send(favorites_games);
  } catch (error) {
    next(error);
  }
});
router.use("/representive",representive)
module.exports = router;


