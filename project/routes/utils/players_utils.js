const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";
const LEAGUE_ID = 271

async function getPlayerIdsByTeam(team_id) {
  try{
    let player_ids_list = [];
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
      params: {
        include: "squad",
        api_token: process.env.api_token,
      },
    });
    team.data.data.squad.data.map((player) =>
        player_ids_list.push(player.player_id)
    );
    return player_ids_list;
  }catch (error){
    return undefined
  }
}

async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players = []
  let players_info = await Promise.all(promises);
  players_info.map((player) =>{
    players.push(player.data.data)
  });
  //console.log(players_info[0].data)
  return extractRelevantPlayerData(players);
}


function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { player_id, fullname, image_path, position_id } = player_info;
    let name = player_info.team.data.name
    return {
      id:player_id,
      full_name: fullname,
      Team_name: name,
      image: image_path,
      position: position_id,
    };
  });
}

async function getPlayersByName(name){
  let players = await axios.get(`${api_domain}/players/search/${name}`, {
    params: {
      include: "team.league",
      api_token: process.env.api_token,
    },
  });
  players = players.data.data.filter((player) => {
      return player.team !== undefined && player.team.data.league !== undefined && player.team.data.league.data.id === LEAGUE_ID
  })
  let res_players = extractRelevantPlayerData(players)
  return res_players
}
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  if (!player_ids_list){
    return undefined
  }
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

async function getPlayerById(Player_id){
  try{
    const player = await axios.get(`${api_domain}/players/${Player_id}`, {
      params: {
        api_token: process.env.api_token,
        include: "team",
      },
    });
    const {player_id, fullname, image_path, position_id, common_name, nationality, birthdate, birthcountry, height, weight} = player.data.data
    const { name } = player.data.data.team.data;
    return {
      id: player_id,
      full_name: fullname,
      Team_name: name,
      image: image_path,
      position_number: position_id,
      Common_name: common_name,
      Nationality: nationality,
      Birthday: birthdate,
      CountryBirth: birthcountry,
      Height: height,
      Weight: weight
    };
  }catch (error){
    return {status: 404, message: 'not found'}
  }

}


exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayerById = getPlayerById;
exports.getPlayerByName = getPlayersByName