import { createContext, useContext } from "react";
import signalRconnection from "../signalR/signalRconnection";

interface GameContextValue {
  connection: signalRconnection;
}

export const GameContext = createContext<GameContextValue>({
  connection: new signalRconnection(),
});

export function useGameContext() {
  const context = useContext(GameContext);

  if (context === undefined)
    throw Error("oops - we do not seem to be inside the provider");

  return context;
}
