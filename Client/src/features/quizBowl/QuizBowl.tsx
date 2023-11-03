import { useState, useEffect, useMemo, useContext } from "react";
import { Question } from "../../question";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../app/Store/configureStore";
import { Box, Card, Paper } from "@mui/material";
import Typography from "@material-ui/core/Typography";
import {
  getUsersInGame,
  leaveGame,
  loser,
  updateGame,
  updatePlayer,
  updateUsersInGame,
  updateUsersInGameWithPlayer,
  winner,
} from "./quizSlice";
import QuestionBox from "./QuestionBox";
import { useNavigate } from "react-router-dom";
import { router } from "../../app/router/Routes";
import { SignalRContext } from "../signalR/signalRContext";
import { GameState } from "./GameState";
import { Player } from "./Player";

export default function QuizBowl() {
  const [questions, setQuestions] = useState<Question[]>([]);

  //const [questionIndex, setQI] = useState(0);
  const [answer, setAnswer] = useState("");

  const [isLoading, setLoading] = useState(true);
  //const [buzzedIn, setBuzzIn] = useState(false);
  //const [buzzedInPlayer, setBuzzedInPlayer] = useState("");
  const [gameJoinedOnHub, setGameJoinedOnHub] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const { gameState, usersInGame, player } = useAppSelector(
    (state) => state.quiz
  );

  //use signalrcontext to maintain a connection *it still disconnects and reconnects automatically though
  const connection = useContext(SignalRContext);

  //Signals to send through signalRconnection to signalRHub
  const {
    groupIncorrectAnswerEvent,
    groupIncorrectAnswerSignal,
    groupBuzzInSignal,
    groupScoreEvent,
    groupScoreSignal,
    groupBuzzInEvent,
    groupWinnerSignal,
    startGameSignal,
    startGameEvent,

    leaveGameSignal,
    winnerEvent,
    incrementQuestionIndexEvent,
    groupIncrementQuestionIndexSignal,
    playerAddedToGameEvent,

    createOrJoinGroupSignal,
  } = connection.connection;

  const dispatch = useAppDispatch();

  const playerName = useMemo(() => player?.userName, [player?.userName]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("player added to game event");
    playerAddedToGameEvent((playerTemp: Player, tempGameState: GameState) => {
      //console.log("player added to game event");
      if (playerName == playerTemp.userName) {
        if (playerTemp) {
          const tempPlayer: Player = {
            ...playerTemp,
            gameName: tempGameState.gameName,
            gameStateId: tempGameState.id,
          };
          if (tempPlayer && tempPlayer.gameStateId) {
            dispatch(updatePlayer(tempPlayer)).then(() => {
              if (tempPlayer.gameStateId)
                dispatch(getUsersInGame(tempPlayer.gameStateId));
            });
            setGameJoinedOnHub(true);
          }
        }

        //  setQI(tempGameState.questionIndex);
      }
    });
  }, [playerAddedToGameEvent, dispatch, playerName]);

  //This is called by button click and sends signal to SignalR that current player is joining the given game
  function joinGameOnHub() {
    if (gameState && player) {
      const tempPlayer: Player = {
        ...player,
        //  gamesJoined: player.gamesJoined + gameState.gameName + ";",
      };

      createOrJoinGroupSignal(gameState, tempPlayer);
    }
  }

  //Called either when pressing Leave Button before joining hub or after joining hub and pressing
  //leave hub button.  dispatches leaveGame event which updates the player and our player state
  function leaveGameOnHub() {
    if (gameState && player) {
      const newPlayer: Player = {
        ...player,
        gameName: "",
        gameStateId: null,
        incorrect: false,
        ready: false,
        nextQuestion: false,
      };
      dispatch(leaveGame(newPlayer));
      leaveGameSignal(gameState.gameName, player.userName, player.id);
    }
    router.navigate("/Lobby");
  }

  //after start game signal startgameevent sets players state value to true
  //beginning the game.  The game is updated here via the dispatch

  //This gets called with old values of gameState. Needs to be investigated******
  useEffect(() => {
    console.log("start game event");
    startGameEvent((gameName: string) => {
      //console.log("start game event");
      if (gameState)
        if (gameState.gameName == gameName) {
          setStartGame(true);
          const updatedGame: GameState = { ...gameState, status: "Starting" };

          dispatch(updateGame(updatedGame));
        }
    });
  }, [gameState, dispatch, startGameEvent]);

  //called by pressing start button. will begin game for all players via startgamesignal
  function startGameNow() {
    if (gameState) startGameSignal(gameState.gameName);
  }

  //This is called on a correct answer.  Sets buzz in to false for everyone and makes sure we are all on

  useEffect(() => {
    console.log("group score event");
    groupScoreEvent((newPlayer: Player, newUsersInGame: Player[]) => {
      //console.log("group score event");
      if (playerName != newPlayer.userName)
        dispatch(updateUsersInGame(newUsersInGame));
    });

    // setBuzzIn(false);

    // setQI((c) => c + 1);
  }, [groupScoreEvent, playerName, dispatch]);

  //console.log(questionIndex + " is qI");

  //event handler for handler that will award points then pass to everyone through websocket
  //also triggers winning event if points are over the threshold
  const checkAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("check Answer");
    if (gameState)
      if (
        answer == questions[gameState.questionIndex % questions.length].answer
      ) {
        if (player && gameState) {
          const newPlayer: Player = {
            ...player,
            score:
              player.score +
              questions[gameState.questionIndex % questions.length].points,
            ready: false,
            incorrect: false,
            nextQuestion: false,
          };

          if (usersInGame) {
            const updatedUsers: Player[] = usersInGame?.map((userInGame) => {
              const tempPlayer: Player = {
                ...userInGame,
                ready: false,
                incorrect: false,
                nextQuestion: false,
              };
              return tempPlayer;
            });
            dispatch(updatePlayer(newPlayer)).then(() => {
              dispatch(updateUsersInGame(updatedUsers));

              dispatch(updateUsersInGameWithPlayer(newPlayer));
            });
          }

          if (player.score >= gameState.scoreToWin) {
            console.log("player enough to win");
            if (usersInGame) groupWinnerSignal(player, gameState, usersInGame);
          } else if (usersInGame) {
            console.log("player score signal");
            groupScoreSignal(gameState.gameName, newPlayer, usersInGame);
          }
        }
      } else {
        if (player && gameState)
          groupIncorrectAnswerSignal(player, gameState.gameName);
      }
  };
  useEffect(() => {
    console.log("group incorrect answer event");
    groupIncorrectAnswerEvent((tempPlayer: Player) => {
      //console.log("Incorrect answer event");
      if (playerName) {
        if (tempPlayer.userName == playerName) {
          tempPlayer.incorrect = true;
          dispatch(updatePlayer(tempPlayer)).then(() => {
            if (tempPlayer.gameStateId)
              dispatch(updateUsersInGameWithPlayer(tempPlayer));
          });
        } else {
          if (tempPlayer.gameStateId)
            dispatch(updateUsersInGameWithPlayer(tempPlayer));
        }
      }
    });

    //  if (userName == playerName) {
    //  setIncorrect((c) => (c ? true : true));
    //  //console.log(userName);
  }, [groupIncorrectAnswerEvent, dispatch, playerName]);

  useEffect(() => {
    console.log("fetch questions");
    fetch(import.meta.env.VITE_API_URL + "/questions")
      .then((response) => response.json())
      .then((data: Question[]) => {
        setQuestions(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("Inc question index");
    incrementQuestionIndexEvent(
      (tempPlayer: Player, tempGameState: GameState) => {
        if (playerName != tempPlayer.userName)
          dispatch(updateGame(tempGameState));
      }
    );
  }, [incrementQuestionIndexEvent, playerName, dispatch]);

  useEffect(() => {
    console.log("winner event");
    winnerEvent((tempPlayer, tempGameState) => {
      //console.log("winner event");
      if (playerName == tempPlayer.userName) {
        {
          tempPlayer = {
            ...tempPlayer,
            score: 0,
            gameStateId: null,
            nextQuestion: false,
            ready: false,
            gameName: "",
          };
          const newTempGameState = {
            ...tempGameState,

            status: "Winner",
          };

          dispatch(winner([newTempGameState, tempPlayer])).then(() =>
            router.navigate("/Winner")
          );
        }
      } else {
        tempPlayer = {
          ...tempPlayer,
          score: 0,
          gameStateId: null,
          nextQuestion: false,
          ready: false,
          gameName: "",
        };
        tempGameState = {
          ...tempGameState,

          status: "Loser",
        };
        dispatch(loser([tempGameState, tempPlayer])).then(() =>
          router.navigate("/Loser")
        );
      }
    });
  }, [dispatch, winnerEvent, playerName, navigate]);

  useEffect(() => {
    console.log("group buzz in effect");
    groupBuzzInEvent((gameState) => {
      //console.log("Group buzz in event");

      dispatch(updateGame(gameState));
      //setBuzzedInPlayer(userName);
      //setBuzzIn(true);
    });
  }, [groupBuzzInEvent, dispatch]);

  function updateGameStateBuzzIn() {
    if (gameState && player) {
      const tempGameState: GameState = {
        ...gameState,
        buzzedInPlayerId: player.id,
      };
      dispatch(updateGame(tempGameState));
      groupBuzzInSignal(tempGameState);
    }
  }
  function incrementSignal() {
    // //console.log("inc signal");
    if (gameState && player) {
      const tempGameState: GameState = {
        ...gameState,
        questionIndex: gameState.questionIndex + 1,
      };
      dispatch(updateGame(tempGameState));
      groupIncrementQuestionIndexSignal(player, tempGameState);
    }
  }

  function updatePlayerReady(isReady: boolean) {
    if (player) {
      const newPlayer: Player = { ...player, ready: isReady };
      dispatch(updatePlayer(newPlayer)).then(() =>
        updateUsersInGameWithPlayer(newPlayer)
      );
    }
  }

  let disable: boolean;
  if (gameState?.buzzedInPlayerId != 0) disable = true;

  //if (buzzedIn) disable = true;

  console.log("QuizBowl");
  console.log(gameState);
  console.log(player);
  return (
    <Paper elevation={3}>
      <Typography variant="h4" mb="30px" className="generalHeading">
        {gameState?.gameName}
      </Typography>
      <Typography variant="h6" mb="30px" className="scoreHeading">
        Target Score : {gameState?.scoreToWin}
      </Typography>
      <Box className="buttonBox">
        {!gameJoinedOnHub && (
          <Box>
            <Button
              type="button"
              className="buttonBox"
              variant="contained"
              onClick={joinGameOnHub}
            >
              Join Game on Hub
            </Button>
            <Button
              type="button"
              className="buttonBox"
              variant="contained"
              onClick={leaveGameOnHub}
            >
              Leave Game
            </Button>
          </Box>
        )}
        {gameJoinedOnHub && (
          <Box display="flex">
            <Button
              type="button"
              className="buttonBox"
              variant="contained"
              onClick={leaveGameOnHub}
            >
              Leave Game on Hub
            </Button>

            {player && !startGame && (
              <Button
                type="button"
                className="buttonBox"
                variant="contained"
                onClick={startGameNow}
              >
                Start
              </Button>
            )}
          </Box>
        )}
      </Box>
      {startGame && !isLoading && gameState && (
        <QuestionBox
          onClick={incrementSignal}
          questions={questions}
          questionIndex={gameState.questionIndex}
        />
      )}
      {startGame &&
        usersInGame &&
        gameState &&
        usersInGame.map((mappedPlayer) => (
          <Box mb="30px" key={mappedPlayer.userName}>
            <Card>
              <Typography className="generalHeading" variant="h6">
                Player {mappedPlayer.userName}
              </Typography>
              <Typography className="generalHeading2" variant="h6">
                Score {mappedPlayer.score}
              </Typography>

              {player &&
                !player.incorrect &&
                player.userName == mappedPlayer.userName && (
                  <Box className="buttonBox">
                    <Button
                      type="button"
                      disabled={disable}
                      onClick={() => {
                        updateGameStateBuzzIn();
                        updatePlayerReady(true);
                      }}
                    >
                      Buzz In
                    </Button>
                  </Box>
                )}

              {player &&
                !player.incorrect &&
                gameState.buzzedInPlayerId == mappedPlayer.id &&
                mappedPlayer.userName == player.userName && (
                  <Box className="buttonBox">
                    <Box component="form" onSubmit={(e) => checkAnswer(e)}>
                      <input
                        type="text"
                        onChange={(e) => setAnswer(e.target.value)}
                        value={answer}
                      />
                      <Button type="submit">Check Answer</Button>
                    </Box>
                  </Box>
                )}
              {player &&
                player.incorrect &&
                mappedPlayer.userName == player.userName && (
                  <Box className="buttonBox">
                    <Box>
                      <Typography>
                        Incorrect Answer given this round. Wait for next round
                      </Typography>
                    </Box>
                  </Box>
                )}
            </Card>
          </Box>
        ))}
    </Paper>
  );
}
