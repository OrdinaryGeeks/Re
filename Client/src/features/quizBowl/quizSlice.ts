import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import agent from "../../app/client";
import { router } from "../../app/router/Routes";
import { GameState } from "./GameState";
import { Player } from "./Player";
import axios from "axios";
import { Question } from "../../question";
interface QuizState {
  gameState: GameState | null;
  player: Player | null;
  usersInGame: Player[] | null;
  gameList: GameState[] | null;
  errorInQuizSlice: string;
  questions: Question[];
}
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
const initialState: QuizState = {
  gameState: null,
  player: null,
  gameList: null,
  usersInGame: [],
  errorInQuizSlice: "",
  questions: [],
};

export const getQuestions = createAsyncThunk<Question[]>(
  "question/getQuestions",
  async (_, thunkAPI) => {
    try {
      return await agent.Question.getQuestions();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);
//Uses user from account slice to create a player with their email and username
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
      const getThePlayer: Player = await agent.Player.getPlayer(
        currentPlayer.id
      );

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

export const updatePlayerForNextQuestion = createAsyncThunk<Player, Player>(
  "player/prepare",
  async (data, thunkAPI) => {
    try {
      const newPlayer: Player = {
        ...data,
        ready: false,
        incorrect: false,
      };
      await agent.Player.updatePlayer(newPlayer);

      return newPlayer;
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
    const newPlayer: Player = {
      ...data[0],
      gameStateId: data[1].id,
      gamesJoined: data[1].gameName + ";",
    };

    await agent.Player.updatePlayer(newPlayer);

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

        return [game, inGamePlayers, currentPlayer, errorInCreate];
      }

      localStorage.setItem("game", JSON.stringify(game));

      currentPlayer = JSON.parse(player);
      currentPlayer.gamesJoined += data.gameName + ";";
      currentPlayer.gameStateId = data.id;

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
      await agent.Player.updatePlayer(data);

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

export const winner = createAsyncThunk<[GameState, Player], [number, number]>(
  "game/winner",
  async (data, thunkAPI) => {
    try {
      const player = await agent.Player.finishedGame(data[1]);
      const game = await agent.Game.wonGame(data[0]);
      localStorage.setItem("game", JSON.stringify(game));

      return [game, player];
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

export const loser = createAsyncThunk<[GameState, Player], [number, number]>(
  "game/loser",
  async (data, thunkAPI) => {
    try {
      const player = await agent.Player.finishedGame(data[1]);
      const game = await agent.Game.lostGame(data[0]);
      localStorage.setItem("game", JSON.stringify(game));

      return [game, player];
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);
export const gameStart = createAsyncThunk<boolean, number>(
  "game/gameStart",
  async (data, thunkAPI) => {
    try {
      await agent.Game.startGame(data);
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);
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

    //players update themselves on their turn. you just update your local copy but this can cause a race condition.
    updateUsersInGameWithPlayer: (state, action) => {
      if (state.usersInGame) {
        const index: number = state.usersInGame?.findIndex(
          (user) => user.email == action.payload.email
        );

        if (index != -1) state.usersInGame[index] = { ...action.payload };
        else state.usersInGame.push(...action.payload);
      }
    },
    updateMakeAllPlayersInGameReady: (state) => {
      if (state.usersInGame) {
        const updateUsersArray: Player[] = state.usersInGame?.map((player) => {
          const tempPlayer: Player = {
            ...player,
            ready: false,
            nextQuestion: false,
            incorrect: false,
          };
          return tempPlayer;
        });
        state.usersInGame = updateUsersArray;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updatePlayerForNextQuestion.fulfilled, (state, action) => {
      state.player = action.payload;
      localStorage.setItem("player", JSON.stringify(state.player));
    });
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
    builder.addCase(gameStart.fulfilled, (state, action) => {
      if (action.payload && state.gameState)
        state.gameState = { ...state.gameState, status: "Starting" };
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
    });
    builder.addCase(getQuestions.fulfilled, (state, action) => {
      state.questions = action.payload;
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

export const {
  updateUsersInGameWithPlayer,
  updateUsersInGame,
  updateMakeAllPlayersInGameReady,
} = quizSlice.actions;
