const DButils = require("./DButils");
const team_utils = require('./teams_utils')

async function getGames(){
    const future_games = await DButils.execQuery(
        'SELECT GameDay, GameTime, HomeTeam, AwayTeam, Field, Game_Id FROM Games WHERE GameResult IS NULL'
    )
    for (let i = 0; i < future_games.length; i++){
        future_games[i].HomeTeam = await team_utils.getTeamNameById(future_games[i].HomeTeam)
        future_games[i].AwayTeam = await team_utils.getTeamNameById(future_games[i].AwayTeam)
    }
    const past_games = await DButils.execQuery(
        'SELECT * FROM Games WHERE GameResult IS NOT NULL'
    )
    for (let i = 0; i < past_games.length; i++){
        past_games[i].HomeTeam = await team_utils.getTeamNameById(past_games[i].HomeTeam)
        past_games[i].AwayTeam = await team_utils.getTeamNameById(past_games[i].AwayTeam)
        let events = await DButils.execQuery(
            `SELECT EventDay,EventHour,Event_min,EvnetType,Player FROM Events WHERE game_id = '${past_games[i].Game_Id}'`
        )
        past_games[i].events = events
    }
    return {
        future_games: future_games,
        past_games: past_games
    }
}

exports.getGames = getGames