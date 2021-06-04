const DButils = require("./DButils");

async function markPlayerAsFavorite(user_id, player_id) {
  await DButils.execQuery(
    `insert into FavoritePlayers values ('${user_id}',${player_id})`
  );
}

async function getFavoritePlayers(user_id) {
  const player_ids = await DButils.execQuery(
    `select player_id from FavoritePlayers where user_id='${user_id}'`
  );
  return player_ids;
}

async function getFavoriteGames(user_id){
  let favorites_games = await DButils.execQuery(
      `SELECT game_id FROM Favorites_Games WHERE username = '${user_id}'`)
  let games = []
  for (let i = 0; i < favorites_games.length; i++) {
    const game_id = favorites_games[i].game_id
    const faves = await DButils.execQuery(
        `SELECT GameDay, GameTime, HomeTeam, AwayTeam, Field, Referee
         FROM Games
         WHERE Game_ID = '${game_id}'`)
    games.push(faves[0])
  }
  return games
}

async function isPastGame(game_id){
  const game = await DButils.execQuery(`SELECT * FROM Games WHERE game_id='${game_id}' and GameResult IS NOT NULL`)
  if (game.length === 0){
    return false
  }
  else{
    return true
  }
}
async function markGameAsFavorite(user_id,game_id){
  const game = await DButils.execQuery(`SELECT * FROM Favorites_Games WHERE game_id='${game_id}' AND username='${user_id}'`)
  if (game.length === 0){
    await DButils.execQuery(
        `INSERT INTO Favorites_Games (username, game_id) VALUES ('${user_id}','${game_id}')`)
    return "success"
  }
  else{
    return "fail"
  }
}

exports.isPastGame = isPastGame
exports.markGameAsFavorite = markGameAsFavorite
exports.getFavoriteGames = getFavoriteGames;
exports.markPlayerAsFavorite = markPlayerAsFavorite;
exports.getFavoritePlayers = getFavoritePlayers;
