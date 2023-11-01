import * as signalR from "@microsoft/signalr";

const hubURL = import.meta.env.VITE_HUB_URL;

export default class signalRConnector {
  private connection: signalR.HubConnection;

  public incrementQuestionIndexEvent: (
    onIncrementQuestionIndex: (userName: string, questionIndex: number) => void
  ) => void;

  public buzzEvent: (
    onBuzzIn: (userName: string, gameName: string) => void
  ) => void;

  public playerReadyEvent: (onPlayerReady: (userID: number) => void) => void;
  public playerNotReadyEvent: (onPlayerNotReady: () => void) => void;
  public groupScoreEvent: (
    onGroupCorrectAnswer: (questionIndex: number) => void
  ) => void;
  public groupIncorrectAnswerEvent: (
    onGroupCorrectAnswer: (userName: string) => void
  ) => void;

  public winnerEvent: (onWinner: (userName: string) => void) => void;

  public playerAddedToGameEvent: (
    onPlayerAddedToGame: (info: string, questionIndex: number) => void
  ) => void;
  public leaveGameEvent: (onLeaveGame: (gameName: string) => void) => void;

  public startGameEvent: (onStartGame: () => void) => void;

  public groupBuzzInEvent: (onGroupBuzzIn: (userName: string) => void) => void;

  static instance: signalRConnector;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubURL)
      .withAutomaticReconnect()
      .build();
    // alert("In constructor");
    this.connection
      .start()
      // .then(() => alert("connectionStartedafef"))

      .catch((err) => document.write(err));

    this.groupBuzzInEvent = (onGroupBuzzIn) => {
      this.connection.on("groupBuzzIn", (userName) => {
        onGroupBuzzIn(userName);
      });
    };

    this.incrementQuestionIndexEvent = (onIncrementQuestionIndex) => {
      this.connection.on(
        "incrementQuestionIndex",
        (userName, questionIndex) => {
          onIncrementQuestionIndex(userName, questionIndex);
        }
      );
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
    this.playerAddedToGameEvent = (onPlayerAddedToGame) => {
      //alert("Hello");
      this.connection.on("playerAddedToGame", (info, questionIndex) => {
        //  alert(info);
        onPlayerAddedToGame(info, questionIndex);
      });
    };
    this.winnerEvent = (onWinner) => {
      this.connection.on("Winner", (userName) => {
        onWinner(userName);
      });
    };

    this.leaveGameEvent = (onLeaveGame) => {
      this.connection.on("playerLeftGame", (userName) => {
        onLeaveGame(userName);
      });
    };
    this.buzzEvent = (onBuzzIn) => {
      this.connection.on("BuzzIn", (userName, gameName) => {
        onBuzzIn(userName, gameName);
      });
    };
    this.startGameEvent = (onStartGame) => {
      this.connection.on("StartGame", () => {
        onStartGame();
      });
    };
    this.groupScoreEvent = (onGroupCorrectAnswer) => {
      this.connection.on("Group Correct Answer", (questionIndex) => {
        onGroupCorrectAnswer(questionIndex);
      });
    };
    this.groupIncorrectAnswerEvent = (onGroupIncorrectAnswer) => {
      // alert("alert");
      this.connection.on("Group Incorrect Answer", (userName) => {
        onGroupIncorrectAnswer(userName);
      });
    };

    this.connection.onclose(() => {
      //  alert("Closed");
    });
  }

  public isConnected = () => {
    return this.connection.state == signalR.HubConnectionState.Connected;
  };

  public playerReadySignal = (
    gameName: string,
    userID: number,
    ready: boolean
  ) => {
    if (ready) this.connection.send("PlayerReadySignal", gameName, userID);
    else this.connection.send("PlayerNotReadySignal", gameName, userID);
  };
  public createOrJoinGroupSignal = (
    gameName: string,
    userName: string,
    userID: number,
    gameID: number
  ) => {
    this.connection.send(
      "CreateOrJoinGame",
      gameName,
      userName,
      userID,
      gameID
    );
  };

  public startGameSignal = (gameID: number) => {
    this.connection.send("StartGame", gameID);
  };
  public leaveGameSignal = (
    gameName: string,
    userName: string,
    userID: number
  ) => {
    this.connection.send("LeaveGame", gameName, userName, userID);
  };

  public groupIncrementQuestionIndexSignal = (
    userName: string,
    gameName: string,
    gameID: number
  ) => {
    this.connection.send("IncrementQuestionIndex", gameName, userName, gameID);
  };
  public groupBuzzInSignal = (userName: string, gameName: string) => {
    this.connection.send("groupBuzzIn", userName, gameName);
  };

  public groupScoreSignal = (
    gameName: string,
    points: number,
    playerID: number,
    gameID: number
  ) => {
    this.connection.send(
      "GroupCorrectAnswer",
      gameName,
      points,
      playerID,
      gameID
    );
  };

  public groupWinnerSignal = (userName: string, gameName: string) => {
    this.connection.send("GroupWinner", userName, gameName);
  };
  public groupIncorrectAnswerSignal = (userName: string, gameName: string) => {
    this.connection.send("GroupIncorrectAnswer", userName, gameName);
  };

  public static getInstance(): signalRConnector {
    if (!signalRConnector.instance)
      signalRConnector.instance = new signalRConnector();
    //signalRConnector.instance.connection.state
    return signalRConnector.instance;
  }
}
//export default signalRConnector.getInstance;
