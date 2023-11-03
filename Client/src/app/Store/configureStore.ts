import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "../../features/account/accountSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { quizSlice } from "../../features/quizBowl/quizSlice";
//import { playerSlice } from "../../features/quizBowl/playerAdapter";

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    quiz: quizSlice.reducer,
    // player: playerSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
