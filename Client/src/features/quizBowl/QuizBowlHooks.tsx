//import { Box, Container, CssBaseline } from "@mui/material";
//import Typography from "@material-ui/core/Typography";
import { useContext, useMemo, useRef, useState } from "react";
import { SignalRContext } from "../signalR/signalRContext";
import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";
import {
  // useClientMethod,
  useClientMethodJoinGame,
  useClientLeaveGame,
  useClientMethodStartGame,
  useClientMethodIncQI,
  useClientMethodBuzzIn,
  useClientScore,
  useClientWinner,
  useIncorrectAnswer,
} from "../Hub/useClientMethod";

import { useHubMethod } from "../Hub/useHubMethod";
//import { GameState } from "./GameState";
//import { Player } from "./Player";
import { useAppSelector, useAppDispatch } from "../../app/Store/configureStore";

import {
  getUsersInGame,
  //getUsersInGame,
  leaveGame,
  loser,
  updateGame,
  updateMakeAllPlayersInGameReady,
  updatePlayer,
  updateUsersInGameWithPlayer,
  winner,
  // updateGame,
  //loser,
  //updateGame,
  //updateMakeAllPlayersInGameReady,
  // updatePlayer,
  //updateUsersInGameWithPlayer,
  //winner,
} from "./quizSlice";
import { Player } from "./Player";
import { router } from "../../app/router/Routes";
import { GameState } from "./GameState";
import QuestionBox from "./QuestionBox";

export default function QuizBowlHooks() {
  const connection = useContext(SignalRContext);
  const [answer, setAnswer] = useState("");
  /*const [checkClientScore, setCheckClientScore] = useState(0);
  const [checkWinner, setCheckWinner] = useState(0);
  const [checkIncorrect, setCheckIncorrect] = useState(0);
  const [checkClientJoinGame, setCheckClientJoinGame] = useState(0);
  const [checkClientLeaveGame, setClientLeaveGame] = useState(0);
  const [checkClientStartGame, setClientStartGame] = useState(0);
  const [checkIncQuestionIndex, setIncQuestionIndex] = useState(0);
  const [checkBuzzInIndex, setBuzzedInIndex] = useState(0);*/
  const [buzzedInPlayer, setBuzzedInPlayer] = useState("");
  const [buzzedIn, setBuzzedIn] = useState(false);
  //const [methodName, setMethodName] = useState("");

  const [questionIndex, setQI] = useState(0);
  const {
    invokeJoinGame,
    invokeLeaveGame,
    invokeStartGame,
    invokeIncrementQuestionIndex,
    invokeBuzzIn,
    invokeWinner,
    invokeScore,
    invokeIncorrectAnswer,
  } = useHubMethod(connection.connection, "NewMessage");
  const { gameState, player, usersInGame, questions } = useAppSelector(
    (state) => state.quiz
  );
  const [gameJoinedOnHub, setGameJoinedOnHub] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const dispatch = useAppDispatch();
  const playerName = useMemo(() => player?.userName, [player?.userName]);

  //useClientMethod(connection.connection, "messageReceived", (_, message) => {
  //    console.log(message);
  //    setMessage(message[0]);
  //  });

  const renderCount = useRef(0);

  renderCount.current = renderCount.current + 1;
  useClientMethodJoinGame(
    connection.connection,

    (playerTemp, tempGameState) => {
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
      } else {
        dispatch(updateUsersInGameWithPlayer(playerTemp));
      }
    }
  );

  useClientMethodBuzzIn(
    connection.connection,

    (buzzedInUserName) => {
      console.log(buzzedInUserName);
      setBuzzedInPlayer(buzzedInUserName);
      setBuzzedIn(true);
    }
  );

  useClientMethodIncQI(
    connection.connection,

    (newQuestionIndex) => {
      console.log(newQuestionIndex);
      dispatch(updateMakeAllPlayersInGameReady());
      setQI(newQuestionIndex);
      setBuzzedIn(false);
    }
  );

  useClientLeaveGame(
    connection.connection,

    (player, gameState) => {
      console.log(player);
      console.log(gameState);
      console.log("Player left game");
    }
  );

  useClientMethodStartGame(
    connection.connection,

    (newGameState) => {
      console.log("start " + newGameState.gameName);
      setStartGame(true);

      if (gameState) {
        const updatedGame: GameState = { ...gameState, status: "Starting" };

        dispatch(updateGame(updatedGame));
      }
    }
  );

  useIncorrectAnswer(
    connection.connection,

    (tempPlayer) => {
      console.log("Incorrect answer event");
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
    }
  );

  //  if (userName == playerName) {
  //  setIncorrect((c) => (c ? true : true));
  //  //console.log(userName);

  useClientWinner(
    connection.connection,

    (tempPlayer, tempGameState) => {
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
        const newTempGameState = {
          ...tempGameState,

          status: "Loser",
        };
        dispatch(loser([newTempGameState, tempPlayer])).then(() =>
          router.navigate("/Loser")
        );
      }
    }
  );

  useClientScore(
    connection.connection,

    (playerWithScore) => {
      if (playerName == playerWithScore.userName) {
        playerWithScore.incorrect = false;
        console.log(playerWithScore.score);
        dispatch(updatePlayer(playerWithScore)).then(() => {
          if (playerWithScore.gameStateId)
            dispatch(updateUsersInGameWithPlayer(playerWithScore));
        });
      }
      //leave everyone else alone. For the players in this game on the client side
      //make them all ready
      else {
        if (gameState) dispatch(updateUsersInGameWithPlayer(playerWithScore));
        dispatch(updateMakeAllPlayersInGameReady());
      }

      setBuzzedIn(false);

      setQI((c) => c + 1);
    }
  );
  /* 
  useClientGameState(connection.connection, "StartGame", (gameState) => {
    console.log("starting game");
    console.log(gameState);
    setStartGame(true);
    const updatedGame: GameState = { ...gameState, status: "Starting" };

    dispatch(updateGame(updatedGame));
  }); */

  //Called either when pressing Leave Button before joining hub or after joining hub and pressing
  //leave hub button.  dispatches leaveGame event which updates the player and our player state
  function leaveGameOnHub() {
    if (!gameState || !player) {
      console.log("one or other null");
    }
    if (gameState && player) {
      const newPlayer: Player = {
        ...player,
        gameName: "",
        gameStateId: null,
        incorrect: false,
        ready: false,
        nextQuestion: false,
      };
      console.log("leaveGameONHub Function");
      dispatch(leaveGame(newPlayer));
      setGameJoinedOnHub(false);

      invokeLeaveGame(gameState, player);
    }
    router.navigate("/Lobby");
  }

  function incrementQuestion() {
    if (gameState && player) {
      invokeIncrementQuestionIndex(player, gameState.gameName, gameState.id);
    }
  }
  function joinGame() {
    if (gameState && player) {
      invokeJoinGame(gameState, player);
    }
  }
  function startGameNow() {
    if (gameState) {
      console.log("SGN");
      invokeStartGame(gameState);
    }
  }

  const checkAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (answer == questions[questionIndex % questions.length].answer) {
      if (player && gameState) {
        const newPlayer: Player = {
          ...player,
          score:
            player.score + questions[questionIndex % questions.length].points,
        };

        if (
          player.score + questions[questionIndex % questions.length].points >=
          gameState.scoreToWin
        ) {
          //console.log(gameState);
          invokeWinner(player, gameState);
        } else {
          invokeScore(gameState.gameName, newPlayer);
        }
      }
    } else {
      if (player && gameState) {
        invokeIncorrectAnswer(player, gameState.gameName);
      }
    }
  };
  let disable: boolean;
  if (buzzedIn) disable = true;

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" mb="30px" className="generalHeading">
          {gameState?.gameName}
        </Typography>

        {!gameJoinedOnHub && gameState && player && (
          <Box>
            <Button
              type="button"
              className="buttonBox"
              variant="contained"
              onClick={() => joinGame()}
            >
              Join Game on Hub
            </Button>
            <Button
              type="button"
              className="buttonBox"
              variant="contained"
              onClick={() => leaveGameOnHub()}
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
              onClick={() => leaveGameOnHub()}
            >
              Leave Game on Hub
            </Button>

            {player && !startGame && (
              <Button
                type="button"
                className="buttonBox"
                variant="contained"
                onClick={() => startGameNow()}
              >
                Start
              </Button>
            )}
          </Box>
        )}

        {startGame && (
          <QuestionBox
            onClick={incrementQuestion}
            questionIndex={questionIndex}
          />
        )}
        {startGame &&
          usersInGame &&
          gameState &&
          usersInGame.map((mappedPlayer) => (
            <Box key={mappedPlayer.userName} mb="30px">
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
                          invokeBuzzIn(player.userName, gameState.gameName);

                          setBuzzedIn(true);
                        }}
                      >
                        Buzz In
                      </Button>
                    </Box>
                  )}

                {player &&
                  buzzedIn &&
                  !player.incorrect &&
                  buzzedInPlayer == mappedPlayer.userName &&
                  mappedPlayer.userName == player.userName && (
                    <Box className="buttonBox">
                      <Box component="form" onSubmit={checkAnswer}>
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
      </Box>
    </Container>
  );
}
