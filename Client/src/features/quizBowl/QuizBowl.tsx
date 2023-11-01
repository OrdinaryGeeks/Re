import { useState, useEffect, useCallback, useMemo } from "react";
import { Question } from "../../question";
import Button from "@mui/material/Button";

import { useAppDispatch, useAppSelector } from "../../app/Store/configureStore";
import { Box, Card } from "@mui/material";
import Typography from "@material-ui/core/Typography";
import { getGame, getUsersInGame, leaveGame, loser, winner } from "./quizSlice";
import QuestionBox from "./QuestionBox";
import { useNavigate } from "react-router-dom";
import { router } from "../../app/router/Routes";

export default function QuizBowl() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [questionIndex, setQI] = useState(0);
  const [answer, setAnswer] = useState("");

  const [isLoading, setLoading] = useState(true);
  //const [incorrect, setIncorrect] = useState(false);
  const [buzzedIn, setBuzzIn] = useState(false);
  const [buzzedInPlayer, setBuzzedInPlayer] = useState("");
  const [gameJoinedOnHub, setGameJoinedOnHub] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const { gameState, usersInGame, player } = useAppSelector(
    (state) => state.quiz
  );

  const [allPlayersReady, setAllPlayersReady] = useState(false);
  const signalRConnection = useAppSelector(
    (signalR) => signalR.signalR.connection
  );

  const {
    groupIncorrectAnswerEvent,
    playerNotReadyEvent,
    groupIncorrectAnswerSignal,
    groupBuzzInSignal,
    groupScoreEvent,
    groupScoreSignal,
    groupBuzzInEvent,
    groupWinnerSignal,
    startGameSignal,
    startGameEvent,
    leaveGameEvent,
    leaveGameSignal,
    winnerEvent,
    incrementQuestionIndexEvent,
    groupIncrementQuestionIndexSignal,
    playerAddedToGameEvent,
    playerReadySignal,
    playerReadyEvent,

    createOrJoinGroupSignal,
  } = signalRConnection;

  const dispatch = useAppDispatch();

  const getUsers = useCallback(() => {
    if (gameState) dispatch(getUsersInGame(gameState.id));

    console.log(gameState);
  }, [gameState, dispatch]);

  const playerName = useMemo(() => player?.userName, [player?.userName]);
  const navigate = useNavigate();

  useEffect(() => {
    startGameEvent(() => {
      // alert("SGE");
      if (gameState) {
        dispatch(getGame(gameState.id));
        setStartGame(true);
      }
    });
  }, [gameState, dispatch, startGameEvent]);
  useEffect(() => {
    playerAddedToGameEvent((info: string, questionIndex: number) => {
      getUsers();
      // alert("In pATG" + usersInGame);
      console.log(info);
      if (playerName == info) {
        setGameJoinedOnHub(true);
        setQI(questionIndex);
      }
    });
  }, [playerAddedToGameEvent, getUsers, setGameJoinedOnHub, playerName]);

  useEffect(() => {
    playerReadyEvent((userID: number) => {
      getUsers();
      if (usersInGame) {
        if (
          usersInGame?.filter((checkUser) => {
            if (!checkUser.ready) {
              console.log(checkUser?.userName);
              return true;
            } else return false;
          }).length == 0
        ) {
          console.log(userID + "Click start game if you ready");
          setAllPlayersReady(true);
        }
      }
    });
  }, [playerReadyEvent, usersInGame, getUsers]);

  useEffect(() => {
    playerNotReadyEvent(() => {
      console.log("player not ready");
      getUsers();
      setAllPlayersReady(false);
    });
  }, [playerNotReadyEvent, getUsers]);
  useEffect(() => {
    leaveGameEvent((info: string) => {
      getUsers();
      console.log(info);
      //if (playerName != info) {
      // alert(info + " left the game");
    });
  }, [leaveGameEvent, getUsers, setGameJoinedOnHub, playerName, dispatch]);

  useEffect(() => {
    groupIncorrectAnswerEvent((userName: string) => {
      //  if (userName == playerName) {
      //  setIncorrect((c) => (c ? true : true));
      console.log(userName);
    });
  }, [groupIncorrectAnswerEvent]);

  useEffect(() => {
    // alert("fetching questions");
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
    if (player && gameState)
      if (player.score >= gameState?.scoreToWin) {
        groupWinnerSignal(player?.userName, gameState?.gameName);
      }
  }, [player, gameState, groupWinnerSignal]);

  useEffect(() => {
    groupScoreEvent((questionIndex: number) => {
      getUsers();
      //if (usersInGame) alert(usersInGame.length);
      setBuzzIn(false);
      //  setIncorrect((c) => (c ? false : false));
      setQI(questionIndex);
    });
  }, [getUsers, groupScoreEvent]);
  useEffect(() => {
    incrementQuestionIndexEvent((userName: string, questionIndex: number) => {
      console.log(userName + " in increment qi");

      setQI(questionIndex);
      // setIncorrect((c) => (c ? false : false));
    });
  }, [incrementQuestionIndexEvent, playerName]);

  useEffect(() => {
    winnerEvent((userName) => {
      if (playerName == userName) {
        //  alert("You Have Won");

        if (gameState && player) {
          dispatch(winner([gameState, player])).then(() =>
            router.navigate("/Winner")
          );
        }
      } //alert("You Have Lost");
      else {
        if (gameState && player) {
          dispatch(loser([gameState, player])).then(() =>
            router.navigate("/Loser")
          );
        }
      }
    });
  }, [dispatch, winnerEvent, playerName, navigate, gameState, player]);
  // const elapsedTime = useRef(0);
  useEffect(() => {
    groupBuzzInEvent((userName) => {
      if (player) {
        setBuzzedInPlayer(userName);
        setBuzzIn(true);
      }
    });
  }, [groupBuzzInEvent, player]);

  function joinGameOnHub() {
    if (gameState && player)
      createOrJoinGroupSignal(
        gameState.gameName,
        player.userName,
        player.id,
        gameState.id
      );
  }

  function leaveGameOnHub() {
    if (gameState && player) {
      //alert("leaving game");
      // alert(player.gameName + " " + player.userName);
      leaveGameSignal(gameState.gameName, player.userName, player.id);
      dispatch(leaveGame());
    }
  }

  function incrementSignal() {
    console.log("inc signal");
    if (gameState && player)
      groupIncrementQuestionIndexSignal(
        player.userName,
        gameState.gameName,
        gameState.id
      );
  }

  function readyToStartGame() {
    if (player && player.gameName) {
      // const startPlayer = {...player, ready:true};
      // dispatch(updatePlayer(startPlayer));
      //if(player)
      alert("readyToStart");
      playerReadySignal(player.gameName, player?.id, true);
    }
  }

  function startGameNow() {
    alert("SGN");
    if (gameState) startGameSignal(gameState.id);
  }
  function notReadyToStartGame() {
    if (player && player.gameName) {
      playerReadySignal(player.gameName, player?.id, false);
    }
  }

  const checkAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (answer == questions[questionIndex % questions.length].answer) {
      // alert("Congratulations");

      if (player && gameState)
        groupScoreSignal(
          gameState.gameName,
          questions[questionIndex % questions.length].points,
          player.id,
          gameState.id
        );
    } else {
      //  alert("Wrong answer");
      if (player && gameState)
        groupIncorrectAnswerSignal(player.userName, gameState.gameName);
    }
  };

  /*
  if (buzzedIn) {
    setTimeout(() => {
      if (!incorrect) {
        setBuzzIn(false);
      }
    }, 5000);
  }*/

  let disable: boolean;
  if (buzzedIn) disable = true;
  return (
    <div>
      <Typography variant="h4" mb="30px" className="generalHeading">
        {gameState?.gameName} {startGame && <div>startgame</div>}{" "}
        {gameState?.id} {player?.gameStateId}
      </Typography>

      <Typography>{allPlayersReady && <div>allplayers</div>}</Typography>
      <Typography>{!allPlayersReady && <div>! allplayers</div>}</Typography>
      <Typography variant="h6" mb="30px" className="scoreHeading">
        Target Score : {gameState?.scoreToWin}
      </Typography>

      <Box className="buttonBox">
        {!gameJoinedOnHub && (
          <Button
            type="button"
            className="buttonBox"
            variant="contained"
            onClick={joinGameOnHub}
          >
            Join Game on Hub
          </Button>
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
            {player && !startGame && !player.ready && (
              <Button
                type="button"
                className="buttonBox"
                variant="contained"
                onClick={readyToStartGame}
              >
                Ready to Start
              </Button>
            )}
            {player && !startGame && player.ready && (
              <Button
                type="button"
                className="buttonBox"
                variant="contained"
                onClick={notReadyToStartGame}
              >
                Not Ready to Start
              </Button>
            )}
            {player && !startGame && allPlayersReady && (
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
                      // setBuzzedInSeconds(5);
                      // setPauseSeconds(questionSeconds);
                      //setBuzzedInPlayer(player.userName);
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
    </div>
  );

  /* function LeaveGame() {
    dispatch(leaveGame());
  }*/
  /* return (
    <div>
      <>
        {gameState?.gameName}
        <Button onClick={() => LeaveGame()}>Leave Game</Button>
      </>

      {!inGameOnHub && (
        <Button type="button" variant="contained" onClick={joinGameOnHub}>
          Join Game on Hub
        </Button>
      )}
      <Card>
        <Typography variant="h6">{seconds}</Typography>
        <Typography variant="h6">Current Question</Typography>
        <Typography variant="h6">{questions[questionIndex].text}</Typography>
        {!buzzedIn && <Box>Question Seconds {questionSeconds}</Box>}
        <Button variant="contained" type="button" onClick={changeQI}>
          Next Question
        </Button>
      </Card>

      {players &&
        gameState &&
        players.map((player) => (
          <Card>
            <Typography variant="h6">
              Player {player.userName} Score {player.score}
            </Typography>
            <Button
              type="button"
              disabled={buzzedIn}
              onClick={() => {
                buzzInSignal(player.userName, gameState.gameName);
                setBuzzIn(true);
                setBuzzedInSeconds(5);
                setPauseSeconds(questionSeconds);
                //setBuzzedInPlayer(player.userName);
              }}
            >
              Buzz In
            </Button>
            {buzzedIn && buzzedInPlayer == player.userName && (
              <Box>Buzzed In Seconds {buzzedInSeconds}</Box>
            )}
            <form onSubmit={(e) => checkAnswer(e)}>
              <input
                type="text"
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
              />
              <Button type="submit">Check Answer</Button>
            </form>
          </Card>
        ))}
    </div>
  );*/
}
