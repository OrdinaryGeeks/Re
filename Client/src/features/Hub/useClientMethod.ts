import { HubConnection } from "@microsoft/signalr";
import { useEffect } from "react";
import { GameState } from "../quizBowl/GameState";
import { Player } from "../quizBowl/Player";

/**
 * Registers a handler that will be invoked when the hub method with the specified method name is invoked.
 * @param {HubConnection} hubConnection The signalR hub connection.
 * @param {string} methodName The name of the hub method to define.
 * @param {Function} method The handler that will be raised when the hub method is invoked.
 */
export function useClientMethod(
  hubConnection: HubConnection | undefined,
  methodName: string,
  method: (...args: string[]) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }

    hubConnection.on(methodName, method);

    return () => {
      hubConnection.off(methodName, method);
    };
  }, [hubConnection, method, methodName]);
}

export function useClientLeaveGame(
  hubConnection: HubConnection | undefined,

  method: (player: Player, gameState: GameState) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }

    console.log("PlayerLeftGame");
    hubConnection.on("playerLeftGame", method);

    return () => {
      hubConnection.off("playerLeftGame", method);
    };
  });
}

export function useClientScore(
  hubConnection: HubConnection | undefined,

  method: (player: Player) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }

    console.log("Group Correct Answer");
    hubConnection.on("Group Correct Answer", method);

    return () => {
      hubConnection.off("Group Correct Answer", method);
    };
  });
}

export function useIncorrectAnswer(
  hubConnection: HubConnection | undefined,

  method: (player: Player) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }

    console.log("Group Incorrect Answer");
    hubConnection.on("Group Incorrect Answer", method);

    return () => {
      hubConnection.off("Group Incorrect Answer", method);
    };
  });
}

export function useClientWinner(
  hubConnection: HubConnection | undefined,

  method: (player: Player, gameState: GameState) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }
    console.log("Winner");
    hubConnection.on("Winner", method);

    return () => {
      hubConnection.off("Winner", method);
    };
  });
}

export function useClientMethodJoinGame(
  hubConnection: HubConnection | undefined,

  method: (player: Player, gameState: GameState) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }
    console.log("Player added to game");
    hubConnection.on("playerAddedToGame", method);

    return () => {
      hubConnection.off("playerAddedToGame", method);
    };
  });
}

export function useClientMethodBuzzIn(
  hubConnection: HubConnection | undefined,

  method: (userName: string) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }

    console.log("BuzzIN");
    hubConnection.on("groupBuzzIn", method);

    return () => {
      hubConnection.off("groupBuzzIn", method);
    };
  });
}

export function useClientMethodIncQI(
  hubConnection: HubConnection | undefined,

  method: (questionIndex: number) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }
    console.log("Use client QI");
    hubConnection.on("incrementQuestionIndex", method);

    return () => {
      hubConnection.off("incrementQuestionIndex", method);
    };
  });
}

export function useClientMethodStartGame(
  hubConnection: HubConnection | undefined,

  method: (gameState: GameState) => void
) {
  useEffect(() => {
    if (!hubConnection) {
      return;
    }

    console.log("Client method start");
    hubConnection.on("StartGame", method);

    return () => {
      hubConnection.off("StartGame", method);
    };
  });
}
