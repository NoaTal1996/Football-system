const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271

async function getTeamsByName(name){
    let teams = await axios.get(`${api_domain}/teams/search/${name}`, {
        params: {
            include: "league",
            api_token: process.env.api_token,
        },
    });
    teams = teams.data.data.filter((team)=>{
        return team.league !== undefined && team.league.data.id === LEAGUE_ID
    })
    return getTeamRelevantData(teams)

}

function getTeamRelevantData(teams){
    return teams.map((team) => {
        return {
            id: team.id,
            name: team.name,
            logo: team.logo_path
        };
    });
}

async function getTeamNameById(id){
    let team = await axios.get(`${api_domain}/teams/${id}`, {
        params: {
            api_token: process.env.api_token,
        },
    });
    return team.data.data.name
}

exports.getTeamNameById = getTeamNameById
exports.getTeamsByName = getTeamsByName