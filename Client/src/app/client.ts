/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosResponse } from "axios";
import { Player } from "../features/quizBowl/Player";
import { GameState } from "../features/quizBowl/GameState";
import { toast } from "react-toastify";
import { router } from "./router/Routes";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;

    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 404:
        toast.error(data.title);
        break;
      case 403:
        toast.error("You are not allowed to do that!");
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;

        return Promise.reject(error.response);
    }
  }
);

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
  startGame: (value: number) => requests.get("startGame/" + value),
  lostGame: (id: number) => requests.get("games/loser/" + id),
  wonGame: (id: number) => requests.get("games/winner/" + id),

  updateGame: (values: GameState) => {
    requests.put("games/" + values.id, values);
  },
  getPlayersInGame: (value: number) =>
    requests.get("games/usersInGame/" + value),
};
const TestErrors = {
  get400Error: () => requests.get("error/bad-request"),
  get401Error: () => requests.get("error/unauthorized"),
  get404Error: () => requests.get("error/not-found"),
  get500Error: () => requests.get("error/server-error"),
  getValidationError: () => requests.get("error/validation-error"),
};
const Player = {
  getPlayers: () => requests.get("players"),
  getPlayer: (id: number) => requests.get("players/" + id),
  createOrReturn: (values: any) =>
    requests.post("players/CreateIfNotExists", values),
  updateGameState: (values: Player) => {
    requests.put("players/" + values.id, values);
  },
  updatePlayer2: (values: Player) =>
    requests.put2("players/" + values.id, values),
  updatePlayer: (values: Player) =>
    requests.put("players/" + values.id, values),
  finishedGame: (id: number) =>
    requests.get("players/playerFinishedGame/" + id),
};
const Question = {
  getQuestions: () => requests.get("questions"),
};
const agent = {
  Account,
  Game,
  Player,
  TestErrors,
  Question,
};

export default agent;
