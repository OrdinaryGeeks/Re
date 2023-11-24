import * as signalR from "@microsoft/signalr";
import { GameState } from "../quizBowl/GameState";
import { Player } from "../quizBowl/Player";

const hubURL = import.meta.env.VITE_HUB_URL;

export class signalRConnector {
  private connection: signalR.HubConnection;

  public playerAddedToGameEvent: (
    onPlayerAddedToGame: (
      player: Player,
      gameState: GameState,
      messageIndex: number
    ) => void
  ) => void;

  public startGameEvent: (onStartGame: (gameName: string) => void) => void;

  public groupBuzzInEvent: (onGroupBuzzIn: (userName: string) => void) => void;

  public groupScoreEvent: (
    onGroupCorrectAnswer: (player: Player) => void
  ) => void;

  public incrementQuestionIndexEvent: (
    onIncrementQuestionIndex: (questionIndex: number) => void
  ) => void;
  public events: (
    onMessageReceived: (username: string, message: string) => void
  ) => void;

  public events2: (
    onMessageReceived: (username: string, message: string) => void
  ) => void;

  public playerReadyEvent: (onPlayerReady: (userID: number) => void) => void;
  public playerNotReadyEvent: (onPlayerNotReady: () => void) => void;

  public groupIncorrectAnswerEvent: (
    onGroupInCorrectAnswer: (player: Player) => void
  ) => void;

  public winnerEvent: (
    onWinner: (player: Player, gameState: GameState) => void
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
    const opatg = (this.playerAddedToGameEvent = (onPlayerAddedToGame) => {
      this.connection.on(
        "playerAddedToGame",
        (player, gameState, messageIndex) => {
          onPlayerAddedToGame(player, gameState, messageIndex);
        }
      );
    });

    this.connection.off("playerAddedToGame", opatg);

    this.events = (onMessageReceived) => {
      this.connection.on("messageReceived", (username, message) => {
        onMessageReceived(username, message);
      });
    };
    this.events2 = (onMessageReceived2) => {
      this.connection.on("messageReceived2", (username, message) => {
        onMessageReceived2(username, message);
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
      this.connection.on("groupBuzzIn", (userName) => {
        onGroupBuzzIn(userName);
      });
    };

    //Fired after correct score given on client.returns passed in player for other
    //clients to update their usersInGame
    this.groupScoreEvent = (onGroupCorrectAnswer) => {
      this.connection.on("Group Correct Answer", (player) => {
        onGroupCorrectAnswer(player);
      });
    };

    //Fired when a player accumulates enough points to win terminating their game
    //Winners and losers go to different pages
    this.winnerEvent = (onWinner) => {
      this.connection.on("Winner", (player, gameState) => {
        onWinner(player, gameState);
      });
    };

    this.incrementQuestionIndexEvent = (onIncrementQuestionIndex) => {
      this.connection.on("incrementQuestionIndex", (questionIndex) => {
        onIncrementQuestionIndex(questionIndex);
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
    this.connection.send("CreateOrJoinGame", gameState, player);
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
  public groupBuzzInSignal = (userName: string, gameName: string) => {
    this.connection.send("groupBuzzIn", userName, gameName);
  };

  public groupScoreSignal = (gameName: string, player: Player) => {
    this.connection.send("GroupScoreSignal", gameName, player);
  };

  public groupWinnerSignal = (player: Player, gameState: GameState) => {
    this.connection.send("GroupWinner", player, gameState);
  };

  public groupIncrementQuestionIndexSignal = (
    player: Player,
    gameName: string,
    gameID: number
  ) => {
    this.connection.send("IncrementQuestionIndex", gameName, player, gameID);
  };

  public gameCheckSignal = (
    gameName: string,
    userName: string,
    gameID: number
  ) => {
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
