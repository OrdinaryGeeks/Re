import { createSlice } from "@reduxjs/toolkit";
import signalRconnection from "./signalRconnection";

interface signalState {
  connected: boolean;
  message: string;
  connection: signalRconnection;
}

const initialState: signalState = {
  connection: new signalRconnection(),
  connected: false,
  message: "",
};

export const signalRSlice = createSlice({
  name: "signalR",
  initialState,
  reducers: {
    isConnected: (state) => {
      state.connected = state.connection.isConnected();
    },
  },
});
