import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { SignalRContext } from "../signalR/signalRContext";
import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";

import { toast } from "react-toastify";
import { useHubMethod } from "../Hub/useHubMethod";

import { useAppSelector, useAppDispatch } from "../../app/Store/configureStore";

import {
  getUsersInGame,
  leaveGame,
  loser,
  gameStart,
  updateMakeAllPlayersInGameReady,
  updatePlayer,
  updateUsersInGameWithPlayer,
  winner,
} from "./quizSlice";
import { Player } from "./Player";
import { router } from "../../app/router/Routes";
import { GameState } from "./GameState";
import QuestionBox from "./QuestionBox";

export default function QuizBowlHooks() {
  const connection = useContext(SignalRContext);
  const [answer, setAnswer] = useState("");
  const [buzzedInPlayer, setBuzzedInPlayer] = useState("");
  const [buzzedIn, setBuzzedIn] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
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
  } = useHubMethod(connection.connection, "");
  const { gameState, player, usersInGame, questions } = useAppSelector(
    (state) => state.quiz
  );
  const [gameJoinedOnHub, setGameJoinedOnHub] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const dispatch = useAppDispatch();
  const playerName = useMemo(() => player?.userName, [player?.userName]);
  const playerID = useMemo(() => player?.id, [player?.id]);
  const gameID = useMemo(() => gameState?.id, [gameState?.id]);

  const renderCount = useRef(0);

  renderCount.current = renderCount.current + 1;

  useEffect(() => {
    if (!connection.connection) {
      return;
    }

    const playerAddedToGame = (
      playerTemp: Player,
      tempGameState: GameState
    ) => {
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
            setGameJoinedOnHub(() => true);
          }
          toast.success("You have joined the game " + tempGameState.gameName);
        }
      } else {
        dispatch(updateUsersInGameWithPlayer(playerTemp));

        toast.success(
          playerTemp.userName + " has joined " + tempGameState.gameName
        );
      }
    };

    const buzzedInMethod = (buzzedInUserName: string) => {
      setBuzzedInPlayer(() => buzzedInUserName);
      setBuzzedIn(() => true);
      toast.success(buzzedInUserName + " has buzzed In");
    };

    const incQIMethod = (newQuestionIndex: number) => {
      dispatch(updateMakeAllPlayersInGameReady());
      setQI(() => newQuestionIndex);
      setBuzzedIn(() => false);
      setIncorrect(() => false);
      toast.success("Proceeding to next question");
    };

    const playerLeaveGameMethod = (player: Player, gameState: GameState) => {
      toast.success(player.userName + " has left " + gameState.gameName);
    };

    const playerStartGameMethod = (startGameID: number) => {
      if (gameID && gameID == startGameID) {
        setStartGame(() => true);
        toast.success("Game is Starting");
        dispatch(gameStart(gameID));
      }
    };

    const incorrectAnswerMethod = (incorrectPlayer: Player) => {
      if (playerName) {
        if (incorrectPlayer.userName == playerName) {
          setIncorrect(true);
          incorrectPlayer.incorrect = true;
          dispatch(updatePlayer(incorrectPlayer)).then(() => {
            if (incorrectPlayer.gameStateId)
              dispatch(updateUsersInGameWithPlayer(incorrectPlayer));
          });
          toast.error("Incorrect Answer");
        } else {
          if (incorrectPlayer.gameStateId)
            dispatch(updateUsersInGameWithPlayer(incorrectPlayer));
          toast.success(incorrectPlayer.userName + " gave Incorrect Answer");
          setBuzzedIn(() => false);
          setBuzzedInPlayer(() => "");
        }
      }
    };

    const winnerMethod = (
      winningPlayer: Player,
      resolvedGameState: GameState
    ) => {
      if (
        playerName == winningPlayer.userName &&
        gameID == resolvedGameState.id
      ) {
        {
          if (gameID == resolvedGameState.id && playerID) {
            dispatch(winner([gameID, playerID])).then(() =>
              router.navigate("/Winner")
            );
          }
        }
      } else {
        if (gameID == resolvedGameState.id && playerID) {
          dispatch(loser([gameID, playerID])).then(() =>
            router.navigate("/Loser")
          );
        }
      }
    };

    const playerScoreMethod = (playerWhoScored: Player) => {
      if (playerName == playerWhoScored.userName) {
        playerWhoScored.incorrect = false;
        setIncorrect(false);
        dispatch(updatePlayer(playerWhoScored)).then(() => {
          if (playerWhoScored.gameStateId)
            dispatch(updateUsersInGameWithPlayer(playerWhoScored));
        });

        toast.success("You are Correct");
      }
      //leave everyone else alone. For the players in this game on the client side
      //make them all ready
      else {
        setIncorrect(false);
        dispatch(updateUsersInGameWithPlayer(playerWhoScored));
        dispatch(updateMakeAllPlayersInGameReady());

        toast.error(playerWhoScored.userName + " has scored");
      }

      setBuzzedIn(() => false);

      setQI((c) => c + 1);
    };

    connection.connection.on("playerAddedToGame", playerAddedToGame);
    connection.connection.on("groupBuzzIn", buzzedInMethod);
    connection.connection.on("incrementQuestionIndex", incQIMethod);
    connection.connection.on("playerLeftGame", playerLeaveGameMethod);
    connection.connection.on("StartGame", playerStartGameMethod);
    connection.connection.on("playerLeftGame", playerLeaveGameMethod);
    connection.connection.on("Group Incorrect Answer", incorrectAnswerMethod);
    connection.connection.on("Winner", winnerMethod);
    connection.connection.on("Group Correct Answer", playerScoreMethod);

    return () => {
      connection.connection.off("playerAddedToGame", playerAddedToGame);
      connection.connection.off("groupBuzzIn", buzzedInMethod);
      connection.connection.off("incrementQuestionIndex", incQIMethod);
      connection.connection.off("playerLeftGame", playerLeaveGameMethod);
      connection.connection.off("StartGame", playerStartGameMethod);
      connection.connection.off(
        "Group Incorrect Answer",
        incorrectAnswerMethod
      );
      connection.connection.off("Winner", winnerMethod);
      connection.connection.off("Group Correct Answer", playerScoreMethod);
    };
  }, [connection.connection, dispatch, playerName, playerID, gameID]);

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
                  !incorrect &&
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
                  !incorrect &&
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
                  incorrect &&
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
