import * as signalR from "@microsoft/signalr";
import { GameState } from "../quizBowl/GameState";
import { Player } from "../quizBowl/Player";

const hubURL = import.meta.env.VITE_HUB_URL;

export class signalRConnector {
  private connection: signalR.HubConnection;

  public playerAddedToGameEvent: (
    onPlayerAddedToGame: (player: Player, gameState: GameState) => void
  ) => void;

  public startGameEvent: (onStartGame: (gameName: string) => void) => void;

  public groupBuzzInEvent: (
    onGroupBuzzIn: (gameState: GameState) => void
  ) => void;

  public groupScoreEvent: (
    onGroupCorrectAnswer: (player: Player, usersInGame: Player[]) => void
  ) => void;

  public incrementQuestionIndexEvent: (
    onIncrementQuestionIndex: (player: Player, gameState: GameState) => void
  ) => void;

  public playerReadyEvent: (onPlayerReady: (userID: number) => void) => void;
  public playerNotReadyEvent: (onPlayerNotReady: () => void) => void;

  public groupIncorrectAnswerEvent: (
    onGroupInCorrectAnswer: (player: Player) => void
  ) => void;

  public winnerEvent: (
    onWinner: (
      player: Player,
      gameState: GameState,
      usersInGame: Player[]
    ) => void
  ) => void;

  public leaveGameEvent: (onLeaveGame: (gameName: string) => void) => void;

  public gameCheckEvent: (onGameCheck: () => void) => void;

  static instance: signalRConnector;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubURL)
      .withAutomaticReconnect()
      .build();
    this.connection
      .start()

      .catch((err) => document.write(err));

    //Fired when you create a game or a player joins the game
    this.playerAddedToGameEvent = (onPlayerAddedToGame) => {
      this.connection.on("playerAddedToGame", (player, gameState) => {
        console.log("player adeded to game signalrcon");
        onPlayerAddedToGame(player, gameState);
      });
    };

    //Lets other players know that a player has left the game
    this.leaveGameEvent = (onLeaveGame) => {
      this.connection.on("playerLeftGame", (userName) => {
        onLeaveGame(userName);
      });
    };

    //Fired and starts clients quizzes
    this.startGameEvent = (onStartGame) => {
      this.connection.on("StartGame", (gameName) => {
        onStartGame(gameName);
      });
    };

    //fired when client buzzes in and blocks other users from also buzzing in
    this.groupBuzzInEvent = (onGroupBuzzIn) => {
      this.connection.on("groupBuzzIn", (gameState) => {
        onGroupBuzzIn(gameState);
      });
    };

    //Fired after correct score given on client.returns passed in player for other
    //clients to update their usersInGame
    this.groupScoreEvent = (onGroupCorrectAnswer) => {
      this.connection.on("Group Correct Answer", (player, usersInGame) => {
        onGroupCorrectAnswer(player, usersInGame);
      });
    };

    //Fired when a player accumulates enough points to win terminating their game
    //Winners and losers go to different pages
    this.winnerEvent = (onWinner) => {
      this.connection.on("Winner", (player, gameState, usersInGame) => {
        onWinner(player, gameState, usersInGame);
      });
    };

    this.incrementQuestionIndexEvent = (onIncrementQuestionIndex) => {
      this.connection.on("incrementQuestionIndex", (player, gameState) => {
        onIncrementQuestionIndex(player, gameState);
      });
    };

    this.groupIncorrectAnswerEvent = (onGroupIncorrectAnswer) => {
      this.connection.on("Group Incorrect Answer", (player) => {
        onGroupIncorrectAnswer(player);
      });
    };

    this.playerNotReadyEvent = (onPlayerNotReady) => {
      this.connection.on("playerNotReady", () => {
        onPlayerNotReady();
      });
    };

    this.playerReadyEvent = (onPlayerReady) => {
      this.connection.on("playerReady", (userID) => {
        onPlayerReady(userID);
      });
    };

    this.gameCheckEvent = (onGameCheck) => {
      this.connection.on("GameCheck", () => {
        onGameCheck();
      });
    };

    this.connection.onclose(() => {});
  }

  public isConnected = () => {
    return this.connection.state == signalR.HubConnectionState.Connected;
  };

  public createOrJoinGroupSignal = (gameState: GameState, player: Player) => {
    console.log("sending create or join group signal from signalrconn");
    console.log(player);
    console.log(gameState);
    this.connection.send("CreateOrJoinGame", gameState, player);
    console.log("after sending");
  };

  public startGameSignal = (gameName: string) => {
    this.connection.send("StartGame", gameName);
  };
  public leaveGameSignal = (
    gameName: string,
    userName: string,
    userID: number
  ) => {
    this.connection.send("LeaveGame", gameName, userName, userID);
  };
  public groupBuzzInSignal = (gameState: GameState) => {
    this.connection.send("groupBuzzIn", gameState);
  };

  public groupScoreSignal = (
    gameName: string,
    player: Player,
    usersInGame: Player[]
  ) => {
    this.connection.send("GroupScoreSignal", gameName, player, usersInGame);
  };

  public groupWinnerSignal = (
    player: Player,
    gameState: GameState,
    usersInGame: Player[]
  ) => {
    this.connection.send("GroupWinner", player, gameState, usersInGame);
  };

  public groupIncrementQuestionIndexSignal = (
    player: Player,
    gameState: GameState
  ) => {
    this.connection.send("IncrementQuestionIndex", gameState, player);
  };

  public gameCheckSignal = (
    gameName: string,
    userName: string,
    gameID: number
  ) => {
    // alert(gameName + " " + userName + " " + gameID);
    this.connection.send("GameCheckSignal", gameName, userName, gameID);
  };

  public groupIncorrectAnswerSignal = (player: Player, gameName: string) => {
    this.connection.send("GroupIncorrectAnswer", player, gameName);
  };

  public playerReadySignal = (
    gameName: string,
    userID: number,
    ready: boolean
  ) => {
    if (ready) this.connection.send("PlayerReadySignal", gameName, userID);
    else this.connection.send("PlayerNotReadySignal", gameName, userID);
  };

  public static getInstance(): signalRConnector {
    if (!signalRConnector.instance)
      signalRConnector.instance = new signalRConnector();

    //signalRConnector.instance.connection.state
    return signalRConnector.instance;
  }
}
export default signalRConnector.getInstance;
