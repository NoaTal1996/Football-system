const axios = require("axios");
const LEAGUE_ID = 271;
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getLeagueDetails() {
    const league = await axios.get(
        `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
        {
            params: {
                include: "season",
                api_token: process.env.api_token,
            },
        }
    );
    let stage;
    try{
        stage = await axios.get(
            `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
            {
                params: {
                    api_token: process.env.api_token,
                },
            }
        );
        stage = stage.data.data.name
    }catch (error){
        stage = "Season is over, we will meet again in the next season"
    }

    let games = await DButils.execQuery(
        "SELECT TOP(1) * From Games WHERE GameResult is NULL Order By GameDay ASC, GameTime ASC"
    );
    let game_day = games[0].GameDay
    let game_hour = games[0].GameTime
    let home_team = await axios.get(`${api_domain}/teams/${games[0].HomeTeam}`, {
        params: {
            api_token: process.env.api_token,
        },
    });
    let away_team = await axios.get(`${api_domain}/teams/${games[0].AwayTeam}`, {
        params: {
            api_token: process.env.api_token,
        },
    });

    const game = {
        id: games[0].Game_Id,
        date: game_day,
        time: game_hour,
        hometeam: home_team.data.data.name,
        awayteam: away_team.data.data.name,
        field: games[0].Field
    }
    return {
        league_name: league.data.data.name,
        current_season_name: league.data.data.season.data.name,
        current_stage_name: stage,
        details_of_next_game: game
    };
}
exports.getLeagueDetails = getLeagueDetails;
