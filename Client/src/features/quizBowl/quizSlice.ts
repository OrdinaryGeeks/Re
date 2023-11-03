import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import agent from "../../app/client";
import { router } from "../../app/router/Routes";
import { GameState } from "./GameState";
import { Player } from "./Player";
import axios from "axios";
interface QuizState {
  gameState: GameState | null;
  player: Player | null;
  usersInGame: Player[] | null;
  gameList: GameState[] | null;
  errorInQuizSlice: string;
}
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const initialState: QuizState = {
  gameState: null,
  player: null,
  gameList: null,
  usersInGame: [],
  errorInQuizSlice: "",
};

//Uses user from account slice to create a player with their email and username
export const createOrGetPlayer = createAsyncThunk<Player, Player>(
  "player/createOrReturn",
  async (data: Player, thunkAPI) => {
    try {
      const player = await agent.Player.createOrReturn(data);
      console.log(player);
      console.log("is the player");
      const currentPlayer: Player = {
        ...player,

        score: 0,
        gameStateId: null,
        nextQuestion: false,
        ready: false,
        gameName: "",
      };

      console.log(currentPlayer);
      await agent.Player.updatePlayer(currentPlayer);
      const getThePlayer: Player = await agent.Player.getPlayer(
        currentPlayer.id
      );
      console.log(getThePlayer);
      return getThePlayer;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

//Used by Lobby Page Search button to populate game List
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

//used by Lobby page.  Pushes in a gamestate and pulls the data from local storage
export const joinGame = createAsyncThunk<
  [Player, GameState],
  [Player, GameState]
>("game/joinGame", async (data, thunkAPI) => {
  try {
    // console.log(data[0]);
    //console.log(data[1]);
    console.log("join game");
    const newPlayer: Player = {
      ...data[0],
      gameStateId: data[1].id,
      gamesJoined: data[1].gameName + ";",
    };
    console.log(newPlayer);
    await agent.Player.updatePlayer(newPlayer);
    console.log(newPlayer);
    return [newPlayer, data[1]];
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error });
  }
});

export const createGame = createAsyncThunk<
  [GameState, Player[], Player, string],
  GameState
>("game/create", async (data, thunkAPI) => {
  try {
    const game: GameState = await agent.Game.create(data);

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
      incorrect: false,
      gamesJoined: "",
    };
    let inGamePlayers: Player[] = [];

    if (player) {
      currentPlayer = JSON.parse(player);
      if (game.gameName == "Duplicate Game Created") {
        const errorInCreate: string = "Duplicate Game Created";
        //inGamePlayers.push(currentPlayer);
        return [game, inGamePlayers, currentPlayer, errorInCreate];
      }
      // console.log(game.id);

      localStorage.setItem("game", JSON.stringify(game));

      //   const gameState: GameState = JSON.parse(game);
      //  const currentPlayer: Player = JSON.parse(player);
      //  if (gameState.players.find((x) => x == currentPlayer) == undefined)

      currentPlayer = JSON.parse(player);
      currentPlayer.gamesJoined += data.gameName + ";";
      currentPlayer.gameStateId = data.id;
      //  alert(currentPlayer.gameStateId);
      await agent.Player.updateGameState(currentPlayer);
    }

    inGamePlayers = await agent.Game.getPlayersInGame(data.id);
    return [game, inGamePlayers, currentPlayer, ""];
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error });
  }
});
export const getUsersInGame = createAsyncThunk<Player[], number>(
  "game/getUsersInGame",
  async (data, thunkAPI) => {
    try {
      // alert(data);

      return await agent.Game.getPlayersInGame(data);
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const updatePlayer = createAsyncThunk<Player, Player>(
  "player/updatePlayer",
  async (data, thunkAPI) => {
    try {
      //  console.log("in PlayerUPDATEPLAYER");
      await agent.Player.updatePlayer(data);
      //  console.log(data);
      //  console.log("was the data");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const getPlayer = createAsyncThunk<Player, number>(
  "player/getPlayer",
  async (data, thunkAPI) => {
    try {
      const retrievedPlayer: Player = await agent.Player.getPlayer(data);
      return retrievedPlayer;
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
    await agent.Player.updatePlayer(data[1]);

    localStorage.setItem("game", JSON.stringify(data[0]));
    await agent.Game.updateGame(data[0]);
    return [data[0], data[1]];
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error });
  }
});

//the server doesn't return the object on an update so set the store gamestate to the passed in value
export const updateGame = createAsyncThunk<GameState, GameState>(
  "game/updateGame",
  async (data, thunkAPI) => {
    try {
      await agent.Game.updateGame(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);
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
        incorrect: false,
        gamesJoined: "",
      };

      await agent.Player.updatePlayer(currentPlayer);

      const currentGameState: GameState = {
        id: data[0].id,
        gameName: data[0].gameName,

        status: "Finished",
        scoreToWin: data[0].scoreToWin,
        maxPlayers: data[0].maxPlayers,
        questionIndex: data[0].questionIndex,
        buzzedInPlayerId:data[0].buzzedInPlayerId
      };
      localStorage.setItem("game", JSON.stringify(currentGameState));
      await agent.Game.updateGame(currentGameState);
      return [currentGameState, currentPlayer];
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

//used by Lobby page.  Pushes in a gamestate and pulls the data from local storage
export const leaveGame = createAsyncThunk<Player, Player>(
  "game/leaveGame",
  async (data, thunkAPI) => {
    try {
      await agent.Player.updatePlayer(data);

      return data;
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
      state.usersInGame = action.payload;
    },

    updateUsersInGameWithPlayer: (state, action) => {
      if (state.usersInGame) {
        const index: number = state.usersInGame?.findIndex(
          (user) => user.id == action.payload.id
        );
        state.usersInGame[index] = { ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPlayer.fulfilled, (state, action) => {
      state.player = { ...action.payload };
      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));
    });
    builder.addCase(getUsersInGame.fulfilled, (state, action) => {
      state.usersInGame = action.payload;
    });
    builder.addCase(updateGame.fulfilled, (state, action) => {
      state.gameState = { ...action.payload };
    });
    builder.addCase(getGame.fulfilled, (state, action) => {
      state.gameState = { ...action.payload };
    });
    builder.addCase(updatePlayer.fulfilled, (state, action) => {
      state.player = { ...action.payload };
      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));
    });
    builder.addCase(winner.fulfilled, (state, action) => {
      state.gameState = { ...action.payload[0] };
      state.player = { ...action.payload[1] };
      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));
    });
    builder.addCase(loser.fulfilled, (state, action) => {
      state.gameState = { ...action.payload[0] };
      state.player = { ...action.payload[1] };
      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));
      // router.navigate("/Loser");
    });
    builder.addCase(createGame.fulfilled, (state, action) => {
      if (action.payload[3] == "Duplicate Game Created") {
        state.errorInQuizSlice = "Duplicate Game Created";
        state.gameState = null;
      } else {
        state.gameState = { ...action.payload[0] };
        state.errorInQuizSlice = "";
      }
      state.usersInGame = action.payload[1];
      state.player = { ...action.payload[2] };

      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));

      if (state.errorInQuizSlice != "Duplicate Game Created")
        router.navigate("/Game");
      else state.gameState = null;
    });
    builder.addCase(createOrGetPlayer.fulfilled, (state, action) => {
      state.player = action.payload;
      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));
    });
    builder.addCase(joinGame.fulfilled, (state, action) => {
      state.player = { ...action.payload[0] };
      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));
      state.gameState = { ...action.payload[1] };

      router.navigate("/Game");
      // alert(state.player.userName);
      // alert(state.gameState);
    });
    builder.addCase(leaveGame.fulfilled, (state, action) => {
      state.player = { ...action.payload };
      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));
      //localStorage.setItem("player", state.player);
      state.usersInGame = [];
      state.gameState = null;
    });

    builder.addCase(createOrGetPlayer.rejected, (state) => {
      state.player = null;
      if (state.player)
        localStorage.setItem("player", JSON.stringify(state.player));
      localStorage.removeItem("player");
      router.navigate("/");
    });
    builder.addCase(getGames.fulfilled, (state, action) => {
      state.gameList = action.payload;
    });
  },
});

export const { updateUsersInGameWithPlayer, updateUsersInGame } =
  quizSlice.actions;
