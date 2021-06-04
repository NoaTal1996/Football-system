const DButils = require("./DButils");
const team_utils = require('./teams_utils')


async function insert_game(game){
    let id = await DButils.execQuery('SELECT COUNT(Game_Id) AS gid FROM Games');
    id = id[0].gid + 1
    const home_team = game.hometeam
    const away_team = game.awayteam
    let home_id = (await team_utils.getTeamsByName(home_team))[0].id
    let away_id = (await team_utils.getTeamsByName(away_team))[0].id
    await DButils.execQuery(
        `INSERT INTO Games (GameDay, GameTime, HomeTeam, AwayTeam,Field,Game_Id,Referee) VALUES ('${game.date}','${game.time}','${home_id}',
                                                                                         '${away_id}','${game.field}','${id}','${game.referee}')`)
}

async function add_result(result,game_id){
    await DButils.execQuery(
            `UPDATE Games
            SET GameResult = '${result}'
            WHERE Game_Id='${game_id}'`)
    await DButils.execQuery(
        `DELETE FROM Favorites_Games
        WHERE game_id='${game_id}'`)
}

async function add_diary(game_id,diary) {
    for (let i = 0; i < diary.length; i++) {
        await DButils.execQuery(
            `INSERT INTO Events (EventDay, EventHour, Event_min, EvnetType, Game_Id, Player)
             VALUES ('${diary[i].EventDay}', '${diary[i].EventHour}', '${diary[i].Event_Min}',
                     '${diary[i].EvnetType}', '${game_id}', '${diary[i].Player}')`)
    }
}

async function getAllGames(){
    const games = await DButils.execQuery('SELECT * FROM Games')
    return games
}

async function getReferees(){
    const referees = await DButils.execQuery(`SELECT FirstName, LastName FROM Users WHERE user_status='judge'`)
    return referees
}

exports.getReferees = getReferees
exports.getAllGames = getAllGames
exports.add_diary = add_diary
exports.add_result = add_result
exports.insert_game = insert_game