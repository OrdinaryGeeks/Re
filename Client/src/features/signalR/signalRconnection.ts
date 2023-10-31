import * as signalR from "@microsoft/signalr";

const hubURL = import.meta.env.VITE_HUB_URL;

export default class signalRConnector {
  private connection: signalR.HubConnection;

  public incrementQuestionIndexEvent: (
    onIncrementQuestionIndex: (userName: string) => void
  ) => void;

  public events: (
    onMessageReceived: (userName: string, message: string) => void
  ) => void;

  public buzzEvent: (
    onBuzzIn: (userName: string, gameName: string) => void
  ) => void;
  public scoreEvent: (
    onCorrectAnswer: (userName: string, points: number) => void
  ) => void;

  public groupScoreEvent: (
    onGroupCorrectAnswer: (userName: string, points: number) => void
  ) => void;
  public groupIncorrectAnswerEvent: (
    onGroupCorrectAnswer: (userName: string) => void
  ) => void;

  public playerAddedToGameEvent: (
    onPlayerAddedToGame: (info: string) => void
  ) => void;
  public createOrJoinEvent: (
    onCreateOrJoinGroup: (gameName: string) => void
  ) => void;

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
      this.connection.on("incrementQuestionIndex", (userName) => {
        onIncrementQuestionIndex(userName);
      });
    };
    this.playerAddedToGameEvent = (onPlayerAddedToGame) => {
      //alert("Hello");
      this.connection.on("playerAddedToGame", (info) => {
        //  alert(info);
        onPlayerAddedToGame(info);
      });
    };
    this.events = (onMessageReceived) => {
      this.connection.on("messageReceived", (username, message) => {
        onMessageReceived(username, message);
      });
    };

    this.createOrJoinEvent = (onCreateOrJoinGroup) => {
      this.connection.on("CreateOrJoinGroup", (gameName) => {
        onCreateOrJoinGroup(gameName);
      });
    };
    this.buzzEvent = (onBuzzIn) => {
      this.connection.on("BuzzIn", (userName, gameName) => {
        onBuzzIn(userName, gameName);
      });
    };
    this.groupScoreEvent = (onGroupCorrectAnswer) => {
      this.connection.on("Group Correct Answer", (userName, points) => {
        onGroupCorrectAnswer(userName, points);
      });
    };
    this.groupIncorrectAnswerEvent = (onGroupIncorrectAnswer) => {
      // alert("alert");
      this.connection.on("Group Incorrect Answer", (userName) => {
        onGroupIncorrectAnswer(userName);
      });
    };
    this.scoreEvent = (onCorrectAnswer) => {
      this.connection.on("Correct Answer", (userName, points) => {
        onCorrectAnswer(userName, points);
      });
    };
    this.connection.onclose(() => {
      //  alert("Closed");
    });
  }

  public isConnected = () => {
    // alert("In Isconnected");
    return this.connection.state == signalR.HubConnectionState.Connected;
  };
  public createOrJoinGroup = (gameName: string, userName: string) => {
    //if (this.connection.state == signalR.HubConnectionState.Connected) {
    if (this.isConnected())
      //alert("signalr connected");
      this.connection.send("CreateOrJoinGame", gameName, userName);

    //return true;
    //} //else return false;
  };

  public groupIncrementQuestionIndexSignal = (
    userName: string,
    gameName: string
  ) => {
    //  alert("GIQ");
    // alert(this.isConnected());
    this.connection.send("IncrementQuestionIndex", gameName, userName);
  };
  public groupBuzzInSignal = (userName: string, gameName: string) => {
    // alert("GS");
    // alert(this.isConnected());
    this.connection.send("groupBuzzIn", userName, gameName);
  };

  public groupScoreSignal = (
    userName: string,
    gameName: string,
    points: number
  ) => {
    this.connection.send("GroupCorrectAnswer", userName, gameName, points);
  };

  public groupIncorrectAnswerSignal = (userName: string, gameName: string) => {
    this.connection.send("GroupIncorrectAnswer", userName, gameName);
  };
  public score = (userName: string, points: number) => {
    this.connection.send("Correct Answer", userName, points);
  };
  public buzzInSignal = (userName: string, gameName: string | null) => {
    this.connection.send("BuzzIn", userName, gameName);
  };
  public newMessage = (messages: string) => {
    this.connection
      .send("newMessage", "foo", messages)
      .then(() => console.log("sent"));
  };
  public static getInstance(): signalRConnector {
    if (!signalRConnector.instance)
      signalRConnector.instance = new signalRConnector();
    //signalRConnector.instance.connection.state
    return signalRConnector.instance;
  }
}
//export default signalRConnector.getInstance;
