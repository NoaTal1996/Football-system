const DButils = require("./DButils");
const team_utils = require('./teams_utils')
const axios = require("axios");
const scheduele_generator = require('./scheduele_generator')
const COUNTRY_ID = 320
const LEAGUE_ID = 271
const api_domain = "https://soccer.sportmonks.com/api/v2.0";


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

async function create_games_scheduele(games_hours,game_days, start_date,end_date){
    const date_list = scheduele_generator.findClassDays(game_days,start_date,end_date)
    let league_teams = await axios.get(api_domain + `/countries/${COUNTRY_ID }/teams`,
        {
            params: {
                include: "league",
                api_token: process.env.api_token,
            },
        }
    );
    let teams = []
    league_teams = league_teams.data.data.filter((team) =>{
        return team.league.data.id === LEAGUE_ID
    })
    league_teams.map((team) =>
        teams.push({
            id: team.id,
            name: team.name
        })
    );
    for (let i = 0; i < teams.length; i++){
        const team = await axios.get(`https://soccer.sportmonks.com/api/v2.0/teams/${teams[i].id}`,
            {
                params: {
                    include: "venue",
                    api_token: process.env.api_token,
                },
            })
        teams[i].field = team.data.data.venue.data.name
    }
    let scheduele = round_robin(teams)
    let referees = await DButils.execQuery(`SELECT FirstName,LastName FROM Users WHERE user_status='judge'`)
    let pointer = 0
    for (let i = 0; i < scheduele.length; i++){
        shuffle(referees)
        let refs = [referees[0],referees[1],referees[2]]
        shuffle(scheduele[0])
        let dates = [date_list[pointer],date_list[pointer+1]]
        let first_games = scheduele[i].slice(0,Math.ceil(scheduele[i].length/2))
        let last_games = scheduele[i].slice(Math.ceil(scheduele[i].length/2),scheduele[i].length)
        await matchGamesToDay(games_hours,refs,first_games,dates[0])
        await matchGamesToDay(games_hours,refs,last_games,dates[1])
        pointer+=2

    }


}

function round_robin(teams){
    let scheduele = []
    const mid = Math.ceil(teams.length/2)
    let first_half = teams.slice(0,mid)
    let second_half = teams.slice(mid, teams.length).reverse()
    for (let i = 0; i < (teams.length-1)*2; i++){
        let round = []
        for (let j = 0; j < first_half.length; j++){
            if (i % 2 == 0){
                round.push({hometeam: first_half[j],awayteam: second_half[j]})
            }
            else {
                round.push({hometeam:second_half[j],awayteam: first_half[j]})
            }
        }
        scheduele.push(round)
        shift_arrays(first_half,second_half)
    }
    return scheduele

}

function shift_arrays(arr1, arr2){
    let pivot1 = arr2[0]
    let pivot2 = arr1[arr1.length - 1]
    for (let i = arr1.length-1; i > 1; i--){
        arr1[i] = arr1[i-1]
    }
    for (let i = 0; i < arr2.length-1; i++){
        arr2[i] = arr2[i+1]

    }
    arr1[1] = pivot1
    arr2[arr2.length-1] = pivot2
}

function shuffle(array){
    for (let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1));
        [array[i],array[j]] = [array[j], array[i]]
    }
}
async function matchGamesToDay(game_hours,referees,games,day){
    day = day.toISOString().slice(0,10)
    let id = await DButils.execQuery('SELECT COUNT(Game_Id) AS gid FROM Games');
    id = id[0].gid
    for (let i = 0; i < games.length; i++){
        await DButils.execQuery(
            `INSERT INTO Games (GameDay, GameTime, HomeTeam, AwayTeam,Field,Game_Id,Referee) VALUES ('${day}','${game_hours[i]}','${games[i].hometeam.id}',
                                                                                         '${games[i].awayteam.id}','${games[i].hometeam.field}','${id+i+1}','${referees[i].username + referees[i].username}')`)
    }
}
exports.create_games_schedule = create_games_scheduele
exports.getReferees = getReferees
exports.getAllGames = getAllGames
exports.add_diary = add_diary
exports.add_result = add_result
exports.insert_game = insert_game