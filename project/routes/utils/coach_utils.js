const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271
const SEASON_ID = 17328

async function getCoachByName(name){
  let coaches = []
  let teams = await axios.get(`${api_domain}/teams/season/${SEASON_ID}`, {
      params: {
          include: "coach",
          api_token: process.env.api_token,
      },
  });
  teams = teams.data.data.filter((team)=>{
      return team.coach.data.fullname.includes(name);
  })
  for(let i = 0; i < teams.length; i++){
      let coach_id = teams[i].coach.data.coach_id
      coaches.push(await getCoachInfo(coach_id))
  }
  return coaches
}


async function getCoachIdByTeam(team_id){
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            include: "coach",
            api_token: process.env.api_token,
        },
    });
    let coach_id = team.data.data.coach.data.coach_id
    return coach_id
}

async function getCoachInfo(coach_id){
    let info = await axios.get(`${api_domain}/coaches/${coach_id}`, {
        params: {
            api_token: process.env.api_token,
        },
    })
    return extractRelevantCoachData(info);


}

async function extractRelevantCoachData(coach_info) {
    const {coach_id,fullname, image_path} = coach_info.data.data;
    const id = coach_info.data.data.team_id;
    let info = await axios.get(`${api_domain}/teams/${id}`, {
        params: {
            api_token: process.env.api_token,
        },
    })
    return {
        id: coach_id,
        full_name: fullname,
        Team_name: info.data.data.name,
        image: image_path,
    };
}

async function getPlayersByTeam(team_id) {
    let coach = await getCoachIdByTeam(team_id);
    let coach_info = await getCoachInfo(coach);
    return coach_info;
}

async function getCoachById(Coach_id){
    try{
        const coach = await axios.get(`${api_domain}/coaches/${Coach_id}`, {
            params: {
                api_token: process.env.api_token,
            },
        });
        let id = coach.data.data.team_id
        let team = await axios.get(`${api_domain}/teams/${id}`, {
            params: {
                api_token: process.env.api_token,
            },
        })
        const {coach_id, fullname, image_path, common_name, nationality, birthdate, birthcountry} = coach.data.data
        return {
            id: coach_id,
            full_name: fullname,
            team_name: team.data.data.name,
            image: image_path,
            Common_name: common_name,
            Nationality: nationality,
            BirthDate: birthdate,
            CountryBirth: birthcountry,
        };
    }catch (error){
        return {status: 404, message: 'not found'}
    }


}

exports.getCoachById = getCoachById;
exports.getCoachInfo = getCoachInfo;
exports.getCoachByTeam = getPlayersByTeam;
exports.getCoachByName = getCoachByName