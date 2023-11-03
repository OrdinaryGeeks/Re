import {
  createEntityAdapter,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { Player } from "./Player";
import agent from "../../app/client";
//import { RootState } from "../../app/Store/configureStore";

const playerAdapter = createEntityAdapter<Player>();

export const getPlayersAsync = createAsyncThunk<Player[]>(
  "quiz/getPlayersAsync",
  async (_, thunkAPI) => {
    try {
      const players = await agent.Player.getPlayers();
      return players;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error });
    }
  }
);

export const playerSlice = createSlice({
  name: "player",

  initialState: playerAdapter.getInitialState({
    playersLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPlayersAsync.pending, (state) => {
      state.status = "pendingGetPlayers";
    });
    builder.addCase(getPlayersAsync.fulfilled, (state, action) => {
      playerAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.playersLoaded = true;
    });
    builder.addCase(getPlayersAsync.rejected, (state) => {
      state.status = "idle";
    });
  },
});

export const playerSelectors = playerAdapter
  .getSelectors
  //  (state: RootState) => state.player
  ();
