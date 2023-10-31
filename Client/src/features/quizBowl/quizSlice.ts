import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/client";
import { router } from "../../app/router/Routes";
import { GameState } from "./GameState";
import { Player } from "./Player";

interface QuizState {
  gameState: GameState | null;
  player: Player | null;
  usersInGame: Player[] | null;
  gameList: GameState[] | null;
}

const initialState: QuizState = {
  gameState: null,
  player: null,
  gameList: null,
  usersInGame: [],
};

export const createOrGetPlayer = createAsyncThunk<Player, Player>(
  "player/createOrReturn",
  async (data: Player, thunkAPI) => {
    try {
      const player = await agent.Player.createOrReturn(data);
      localStorage.setItem("player", JSON.stringify(player));
      return player;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const getGames = createAsyncThunk<GameState[]>(
  "games/list",
  async (_, thunkAPI) => {
    try {
      const games: GameState[] = await agent.Game.list();

      return games;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const createGame = createAsyncThunk<
  [GameState, Player[], Player],
  GameState
>("game/create", async (data, thunkAPI) => {
  try {
    const game: GameState = await agent.Game.create(data);
    localStorage.setItem("game", JSON.stringify(game));
    const player = localStorage.getItem("player") || null;

    let currentPlayer: Player = {
      userName: "",
      email: "",
      id: 0,
      score: 0,
      gameStateId: 0,
    };
    if (player) {
      //   const gameState: GameState = JSON.parse(game);
      //  const currentPlayer: Player = JSON.parse(player);
      //  if (gameState.players.find((x) => x == currentPlayer) == undefined)

      currentPlayer = JSON.parse(player);

      currentPlayer.gameStateId = data.id;
      //  alert(currentPlayer.gameStateId);
      await agent.Player.updateGameState(currentPlayer);
    }
    let inGamePlayers: Player[] = [];
    inGamePlayers = await agent.Game.getPlayersInGame(data.id);
    return [game, inGamePlayers, currentPlayer];
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error });
  }
});
export const getUsersInGame = createAsyncThunk<Player[], number>(
  "game/getUsersInGame",
  async (data, thunkAPI) => {
    try {
      // alert(data);
      const inGamePlayers: Player[] = await agent.Game.getPlayersInGame(data);

      return inGamePlayers;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);
export const joinGame = createAsyncThunk<
  [GameState, Player[], Player],
  GameState
>("game/joinGame", async (data, thunkAPI) => {
  try {
    const player = localStorage.getItem("player") || null;
    let inGamePlayers: Player[] = [];
    let currentPlayer: Player = {
      userName: "",
      email: "",
      id: 0,
      score: 0,
      gameStateId: 0,
    };
    if (player) {
      //   const gameState: GameState = JSON.parse(game);
      //  const currentPlayer: Player = JSON.parse(player);
      //  if (gameState.players.find((x) => x == currentPlayer) == undefined)

      currentPlayer = JSON.parse(player);

      currentPlayer.gameStateId = data.id;
      //  alert(currentPlayer.gameStateId);
      await agent.Player.updateGameState(currentPlayer);

      inGamePlayers = await agent.Game.getPlayersInGame(data.id);

      localStorage.setItem("game", JSON.stringify(data));
      localStorage.setItem("player", JSON.stringify(currentPlayer));
    }
    return [data, inGamePlayers, currentPlayer];
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error });
  }
});

export const leaveGame = createAsyncThunk<null>(
  "game/leaveGame",
  async (data, thunkAPI) => {
    try {
      const player = localStorage.getItem("player") || null;
      const game = localStorage.getItem("game") || null;
      if (player) {
        if (game) {
          const currentPlayer: Player = JSON.parse(player);
          //  if (gameState.players.find((x) => x == currentPlayer) == undefined)

          currentPlayer.gameStateId = null;
          await agent.Player.updateGameState(currentPlayer);

          localStorage.setItem("game", JSON.stringify(data));
          localStorage.setItem("player", JSON.stringify(currentPlayer));
        }
      }
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    updateUsersInGame: (state, action) => {
      //alert("in updateusersingame");
      console.log("in updateusersingame quizslice");
      state.usersInGame = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsersInGame.fulfilled, (state, action) => {
      state.usersInGame = action.payload;
    });
    builder.addCase(leaveGame.fulfilled, (state, action) => {
      state.gameState = action.payload;
      if (state.player) state.player.gameStateId = null;
      router.navigate("/lobby");
    });
    builder.addCase(createGame.fulfilled, (state, action) => {
      state.gameState = action.payload[0];
      state.usersInGame = action.payload[1];
      state.player = action.payload[2];

      router.navigate("/Game");
    });
    builder.addCase(createOrGetPlayer.fulfilled, (state, action) => {
      state.player = action.payload;
    });
    builder.addCase(joinGame.fulfilled, (state, action) => {
      state.gameState = action.payload[0];
      state.usersInGame = action.payload[1];
      //  alert(state.usersInGame.length + "users in game");
      state.player = action.payload[2];
    });

    builder.addCase(createOrGetPlayer.rejected, (state) => {
      state.player = null;
      localStorage.removeItem("player");
      router.navigate("/");
    });
    builder.addCase(getGames.fulfilled, (state, action) => {
      state.gameList = action.payload;
    });
  },
});

export const { updateUsersInGame } = quizSlice.actions;
