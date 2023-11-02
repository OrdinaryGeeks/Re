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

  const [questionIndex, setQI] = useState(0);
  const [answer, setAnswer] = useState("");

  const [isLoading, setLoading] = useState(true);
  const [buzzedIn, setBuzzIn] = useState(false);
  const [buzzedInPlayer, setBuzzedInPlayer] = useState("");
  const [gameJoinedOnHub, setGameJoinedOnHub] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const { gameState, usersInGame, player } = useAppSelector(
    (state) => state.quiz
  );

  //use signalrcontext to maintain a connection *it still disconnects and reconnects automatically though
  const connection = useContext(SignalRContext);

  //Signals to send through signalRconnection to signalRHub
  const {
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
    playerAddedToGameEvent((playerTemp: Player, tempGameState: GameState) => {
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

        setQI(tempGameState.questionIndex);
      }
    });
  }, [playerAddedToGameEvent, dispatch, playerName]);

  //This is called by button click and sends signal to SignalR that current player is joining the given game
  function joinGameOnHub() {
    if (gameState && player) {
      createOrJoinGroupSignal(gameState, player);
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
  useEffect(() => {
    startGameEvent(() => {
      if (gameState) {
        setStartGame(true);
        const updatedGame: GameState = { ...gameState, status: "Starting" };
        dispatch(updateGame(updatedGame));
      }
    });
  }, [gameState, dispatch, startGameEvent]);

  //called by pressing start button. will begin game for all players via startgamesignal
  //
  function startGameNow() {
    if (gameState) startGameSignal(gameState.gameName);
  }

  //This is called on a correct answer.  Sets buzz in to false for everyone and makes sure we are all on

  useEffect(() => {
    groupScoreEvent((newPlayer: Player) => {
      if (playerName == newPlayer.userName) {
        // alert("dispatching");
        dispatch(updatePlayer(newPlayer)).then(() => {
          if (newPlayer.gameStateId)
            dispatch(updateUsersInGameWithPlayer(newPlayer));
        });
      } else {
        if (newPlayer.gameStateId)
          dispatch(updateUsersInGameWithPlayer(newPlayer));
      }

      setBuzzIn(false);

      setQI((c) => c + 1);
    });
  }, [groupScoreEvent, playerName, dispatch]);

  const checkAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (answer == questions[questionIndex % questions.length].answer) {
      // alert("Congratulations");

      if (player && gameState) {
        const newPlayer: Player = {
          ...player,
          score:
            player.score + questions[questionIndex % questions.length].points,
        };

        if (
          player.score + questions[questionIndex % questions.length].points >
          gameState.scoreToWin
        )
          groupWinnerSignal(player.userName, gameState.gameName);
        else groupScoreSignal(gameState.gameName, newPlayer);
      }
    } else {
      if (player && gameState)
        groupIncorrectAnswerSignal(player.userName, gameState.gameName);
    }
  };

  useEffect(() => {
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
    incrementQuestionIndexEvent((questionIndex: number) => {
      setQI(questionIndex);
    });
  }, [incrementQuestionIndexEvent, playerName]);

  useEffect(() => {
    winnerEvent((userName) => {
      if (playerName == userName) {
        if (player && gameState) {
          const currentPlayer: Player = {
            ...player,
            score: 0,
            gameStateId: null,
            nextQuestion: false,
            ready: false,
            gameName: "",
          };
          const currentGameState: GameState = {
            id: gameState.id,
            gameName: gameState.gameName,

            status: "Finished",
            scoreToWin: gameState.scoreToWin,
            maxPlayers: gameState.maxPlayers,
            questionIndex: gameState.questionIndex,
          };

          if (gameState && player) {
            dispatch(winner([currentGameState, currentPlayer])).then(() =>
              router.navigate("/Winner")
            );
          }
        }
      } else {
        if (gameState && player) {
          dispatch(loser([gameState, player])).then(() =>
            router.navigate("/Loser")
          );
        }
      }
    });
  }, [dispatch, winnerEvent, playerName, navigate, gameState, player]);

  useEffect(() => {
    groupBuzzInEvent((userName) => {
      if (player) {
        setBuzzedInPlayer(userName);
        setBuzzIn(true);
      }
    });
  }, [groupBuzzInEvent, player]);

  function incrementSignal() {
    // console.log("inc signal");
    if (gameState && player)
      groupIncrementQuestionIndexSignal(
        player.userName,
        gameState.gameName,
        gameState.id
      );
  }

  let disable: boolean;
  if (buzzedIn) disable = true;
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
      {startGame && !isLoading && (
        <QuestionBox
          onClick={incrementSignal}
          questions={questions}
          questionIndex={questionIndex}
        />
      )}
      {startGame &&
        usersInGame &&
        gameState &&
        usersInGame.map((mappedPlayer) => (
          <Box mb="30px">
            <Card>
              <Typography className="generalHeading" variant="h6">
                Player {mappedPlayer.userName}
              </Typography>
              <Typography className="generalHeading2" variant="h6">
                Score {mappedPlayer.score}
              </Typography>

              {player && player.userName == mappedPlayer.userName && (
                <Box className="buttonBox">
                  <Button
                    type="button"
                    disabled={disable}
                    onClick={() => {
                      groupBuzzInSignal(player.userName, gameState.gameName);
                      setBuzzIn(true);
                    }}
                  >
                    Buzz In
                  </Button>
                </Box>
              )}

              {player &&
                buzzedIn &&
                buzzedInPlayer == mappedPlayer.userName &&
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
            </Card>
          </Box>
        ))}
    </Paper>
  );
}
