import { HubConnection } from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";
import { GameState } from "../quizBowl/GameState";
import { Player } from "../quizBowl/Player";

type HubMethodState = {
  loading: boolean;
  data?: unknown;
  error?: unknown;
};
const initialState: HubMethodState = {
  loading: false,
};

/**
 * Provide an "invoke" function to invokes a hub method on the server and provide the async state (loading & error)
 * @param hubConnection The hub connection to use
 * @param methodName The name of the server method to invoke.
 */
export function useHubMethod<T>(
  hubConnection: HubConnection | undefined,
  methodName: string
) {
  const [state, setState] = useState<HubMethodState>(initialState);
  const isMounted = useRef(true);

  const setStateIfMounted: typeof setState = useCallback((value) => {
    if (isMounted.current) {
      setState(value);
    }
  }, []);

  const invokePlayerGamestate = useCallback(
    async (gameState: GameState, player: Player, method: string) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>(method, gameState, player);

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );
  const invokeLeaveGame = useCallback(
    async (gameState: GameState, player: Player) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>(
            "LeaveGame",
            gameState,
            player
          );

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );

  const invokeJoinGame = useCallback(
    async (gameState: GameState, player: Player) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>(
            "CreateOrJoinGame",
            gameState,
            player
          );

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );

  const invokeStartGame = useCallback(
    async (gameState: GameState) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>("StartGame", gameState);

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );

  const invokeScore = useCallback(
    async (gameName: string, player: Player) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>(
            "GroupScoreSignal",
            gameName,
            player
          );

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );

  const invokeWinner = useCallback(
    async (player: Player, gameState: GameState) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>(
            "GroupWinner",
            player,
            gameState
          );

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );

  const invokeIncorrectAnswer = useCallback(
    async (player: Player, gameName: string) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>(
            "GroupIncorrectAnswer",
            player,
            gameName
          );

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );
  const invokeBuzzIn = useCallback(
    async (userName: string, gameName: string) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>(
            "GroupBuzzIn",
            userName,
            gameName
          );

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );
  const invokeIncrementQuestionIndex = useCallback(
    async (player: Player, gameName: string, gameID: number) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
          const data = await hubConnection.invoke<T>(
            "IncrementQuestionIndex",
            gameName,
            player,
            gameID
          );

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, setStateIfMounted]
  );

  const invoke = useCallback(
    async (...args: unknown[]) => {
      setStateIfMounted((s) => ({ ...s, loading: true }));

      try {
        if (hubConnection) {
      
          const data = await hubConnection.invoke<T>(methodName, ...args);

          setStateIfMounted((s) => ({
            ...s,
            data: data,
            loading: false,
            error: undefined,
          }));
          return data;
        } else {
          throw new Error("hubConnection is not defined");
        }
      } catch (e) {
        setStateIfMounted((s) => ({ ...s, error: e, loading: false }));
      }
    },
    [hubConnection, methodName, setStateIfMounted]
  );

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  return {
    invoke,
    invokePlayerGamestate,
    invokeJoinGame,
    invokeLeaveGame,
    invokeStartGame,
    invokeIncrementQuestionIndex,
    invokeBuzzIn,
    invokeScore,
    invokeIncorrectAnswer,
    invokeWinner,

    ...state,
  };
}
