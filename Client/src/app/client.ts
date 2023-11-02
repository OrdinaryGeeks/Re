/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from "axios";
import { Player } from "../features/quizBowl/Player";
import { GameState } from "../features/quizBowl/GameState";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  get2: (url: string) => axios.get(url),
  put2: (url: string, body: {}) => axios.put(url, body),
};

const Account = {
  login: (values: any) => requests.post("account/login", values),
  register: (values: any) => requests.post("account/register", values),
  currentUser: () => requests.get("account/currentUser"),
};

const Game = {
  getGame: (value: number) => requests.get("games/" + value),
  create: (values: any) => requests.post("games", values),
  list: () => requests.get("games"),
  lobbyList: () => requests.get("games/lobby"),
  finishedList: () => requests.get("games/finished"),
  updateGame: (values: GameState) => {
    requests.put("games/" + values.id, values);
  },
  getPlayersInGame: (value: number) =>
    requests.get("games/usersInGame/" + value),
};

const Player = {
  getPlayer: (id: number) => requests.get("players/" + id),
  createOrReturn: (values: any) =>
    requests.post("players/CreateIfNotExists", values),
  updateGameState: (values: Player) => {
    //alert("players/" + values.id);
    requests.put("players/" + values.id, values);
  },
  updatePlayer2: (values: Player) =>
    requests.put2("players/" + values.id, values),
  updatePlayer: (values: Player) =>
    requests.put("players/" + values.id, values),
};
const agent = {
  Account,
  Game,
  Player,
};

export default agent;
