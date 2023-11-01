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
      const currentPlayer: Player = {
        ...player,

        score: 0,
        gameStateId: null,
        nextQuestion: false,
        ready: false,
        gameName: "",
      };
      await agent.Player.updatePlayer(currentPlayer);

      localStorage.setItem("player", JSON.stringify(currentPlayer));
      return currentPlayer;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const getGames = createAsyncThunk<GameState[]>(
  "games/list",
  async (_, thunkAPI) => {
    try {
      const games: GameState[] = await agent.Game.lobbyList();

      return games;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);
export const getGame = createAsyncThunk<GameState, number>(
  "game/getGame",
  async (data, thunkAPI) => {
    try {
      const game = await agent.Game.getGame(data);
      localStorage.setItem("game", JSON.stringify(game));
      return game;
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
    const game = await agent.Game.create(data);
    console.log(game.id);

    localStorage.setItem("game", JSON.stringify(game));
    const player = localStorage.getItem("player") || null;

    let currentPlayer: Player = {
      userName: "",
      email: "",
      id: 0,
      score: 0,
      gameStateId: 0,
      nextQuestion: false,
      ready: false,
      gameName: "",
    };
    if (player) {
      //   const gameState: GameState = JSON.parse(game);
      //  const currentPlayer: Player = JSON.parse(player);
      //  if (gameState.players.find((x) => x == currentPlayer) == undefined)

      currentPlayer = JSON.parse(player);
      localStorage.setItem("player", JSON.stringify(currentPlayer));
      currentPlayer.gameStateId = game.id;
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

export const updatePlayer = createAsyncThunk<Player, Player>(
  "player/updatePlayer",
  async (data, thunkAPI) => {
    try {
      const updatedPlayer: Player = await agent.Player.updatePlayer(data);
      return updatedPlayer;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const winner = createAsyncThunk<
  [GameState, Player],
  [GameState, Player]
>("game/winner", async (data, thunkAPI) => {
  try {
    const currentPlayer: Player = {
      userName: data[1].userName,
      email: data[1].email,
      id: data[1].id,
      score: 0,
      gameStateId: null,
      nextQuestion: false,
      ready: false,
      gameName: "",
    };

    await agent.Player.updatePlayer(currentPlayer);
    localStorage.setItem("player", JSON.stringify(currentPlayer));
    const currentGameState: GameState = {
      id: data[0].id,
      gameName: data[0].gameName,

      status: "Finished",
      scoreToWin: data[0].scoreToWin,
      maxPlayers: data[0].maxPlayers,
      questionIndex: data[0].questionIndex,
    };
    localStorage.setItem("game", JSON.stringify(currentGameState));
    await agent.Game.updateGame(currentGameState);
    return [currentGameState, currentPlayer];
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error });
  }
});
export const loser = createAsyncThunk<[GameState, Player], [GameState, Player]>(
  "game/loser",
  async (data, thunkAPI) => {
    try {
      /*     const updatePlayer = data[1];
      updatePlayer.gameName = "";
      updatePlayer.gameStateId = null;
      updatePlayer.score = 0;
 */
      const currentPlayer: Player = {
        userName: data[1].userName,
        email: data[1].email,
        id: data[1].id,
        score: 0,
        gameStateId: null,
        nextQuestion: false,
        ready: false,
        gameName: "",
      };

      localStorage.setItem("player", JSON.stringify(currentPlayer));
      await agent.Player.updatePlayer(currentPlayer);

      const currentGameState: GameState = {
        id: data[0].id,
        gameName: data[0].gameName,

        status: "Finished",
        scoreToWin: data[0].scoreToWin,
        maxPlayers: data[0].maxPlayers,
        questionIndex: data[0].questionIndex,
      };
      localStorage.setItem("game", JSON.stringify(currentGameState));
      await agent.Game.updateGame(currentGameState);
      return [currentGameState, currentPlayer];
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
      ready: false,
      nextQuestion: false,
      gameName: "",
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

export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    updateUsersInGame: (state, action) => {
      //alert("in updateusersingame");
      console.log("in updateusersingame quizslice");
      state.usersInGame = action.payload;
    },
    leaveGame: (state) => {
      //if (action.type == "LeaveGame") {
      // alert(" leaving gme in dispatch");
      state.gameState = null;
      if (state.player) {
        state.player.gameStateId = null;
        state.player.score = 0;
        state.player.nextQuestion = false;
        state.player.ready = false;
      }
      // alert(state.player?.gameStateId + " lg");
      router.navigate("/lobby");
      //}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsersInGame.fulfilled, (state, action) => {
      state.usersInGame = action.payload;

      const playerUpdate = action.payload.find(
        (updatedPlayer) => updatedPlayer.id == state.player?.id
      );
      if (playerUpdate) state.player = playerUpdate;
    });

    builder.addCase(getGame.fulfilled, (state, action) => {
      state.gameState = { ...action.payload };
    });
    builder.addCase(updatePlayer.fulfilled, (state, action) => {
      state.player = { ...action.payload };
    });
    builder.addCase(winner.fulfilled, (state, action) => {
      state.gameState = { ...action.payload[0] };
      state.player = { ...action.payload[1] };

      /*
      if (state.player)
        state.player = {
          ...state.player,
          gameStateId: null,
          gameName: "",
          score: 0,
          ready: false,
          nextQuestion: false,
        };

      if (state.player) {
        state.player.gameStateId = null;
        state.player.score = 0;
        state.player.nextQuestion = false;
        state.player.ready = false;
      }*/
    });
    builder.addCase(loser.fulfilled, (state, action) => {
      state.gameState = { ...action.payload[0] };
      state.player = { ...action.payload[1] };
      // router.navigate("/Loser");
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

export const { updateUsersInGame, leaveGame } = quizSlice.actions;
