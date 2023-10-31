import { useState, useEffect, useCallback, useMemo } from "react";
import { Question } from "../../question";
import Button from "@mui/material/Button";

import { Player } from "./Player";
import { useAppDispatch, useAppSelector } from "../../app/Store/configureStore";
import { Box, Card } from "@mui/material";
import Typography from "@material-ui/core/Typography";
import { getUsersInGame, updateUsersInGame } from "./quizSlice";
import QuestionBox from "./QuestionBox";

export default function QuizBowl() {
  const [questions, setQuestions] = useState<Question[]>([]);

  const [questionIndex, setQI] = useState(0);
  const [answer, setAnswer] = useState("");

  const [isLoading, setLoading] = useState(true);
  const [incorrect, setIncorrect] = useState(false);
  const [buzzedIn, setBuzzIn] = useState(false);
  const [buzzedInPlayer, setBuzzedInPlayer] = useState("");
  const [gameJoinedOnHub, setGameJoinedOnHub] = useState(false);

  const { gameState, usersInGame, player } = useAppSelector(
    (state) => state.quiz
  );

  const signalRConnection = useAppSelector(
    (signalR) => signalR.signalR.connection
  );

  const {
    groupIncorrectAnswerEvent,
    groupIncorrectAnswerSignal,
    groupBuzzInSignal,
    groupScoreEvent,
    groupScoreSignal,
    groupBuzzInEvent,
    incrementQuestionIndexEvent,
    groupIncrementQuestionIndexSignal,
    playerAddedToGameEvent,

    createOrJoinGroup,
  } = signalRConnection;

  const dispatch = useAppDispatch();

  const getUsers = useCallback(() => {
    if (gameState) dispatch(getUsersInGame(gameState.id));

    console.log(gameState);
  }, [gameState, dispatch]);

  const playerName = useMemo(() => player?.userName, [player]);

  useEffect(() => {
    playerAddedToGameEvent((info: string) => {
      getUsers();
      console.log(info);
      if (playerName == info) setGameJoinedOnHub(true);
    });
  }, [playerAddedToGameEvent, getUsers, setGameJoinedOnHub, playerName]);

  useEffect(() => {
    groupIncorrectAnswerEvent((userName: string) => {
      if (userName == playerName) {
        setIncorrect((c) => (c ? true : true));
      }
    });
  }, [playerName, groupIncorrectAnswerEvent]);
  useEffect(() => {
    alert("fetching questions");
    fetch(import.meta.env.VITE_API_URL + "/questions")
      .then((response) => response.json())
      .then((data: Question[]) => {
        setQuestions(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  const getGroupScore = useCallback(
    (userName: string, points: number) => {
      if (usersInGame) {
        const newUsersInGame = usersInGame.map((user) => {
          if (user.userName == userName) {
            const newUser: Player = {
              userName: user.userName,
              score: user.score + points,
              gameStateId: user.gameStateId,
              id: user.id,
              email: user.email,
            };
            console.log("Made newUser");

            return newUser;
          } else return user;
        });
        console.log(newUsersInGame);

        dispatch(updateUsersInGame(newUsersInGame));
      }
    },
    [usersInGame, dispatch]
  );
  useEffect(() => {
    groupScoreEvent((userName: string, points: number) => {
      console.log("GSE");
      getGroupScore(userName, points);
      setIncorrect((c) => (c ? false : false));
      setQI((c) => c + 1);
    });
  }, [getGroupScore, groupScoreEvent]);
  useEffect(() => {
    incrementQuestionIndexEvent((userName: string) => {
      console.log(userName + " in increment qi");

      setQI((c) => c + 1);
      setIncorrect((c) => (c ? false : false));
    });
  }, [incrementQuestionIndexEvent, playerName]);

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
      createOrJoinGroup(gameState.gameName, player.userName);
  }

  function incrementSignal() {
    console.log("inc signal");
    if (gameState && player)
      groupIncrementQuestionIndexSignal(player.userName, gameState.gameName);
  }

  const checkAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (answer == questions[questionIndex % questions.length].answer) {
      alert("Congratulations");

      if (player && gameState)
        groupScoreSignal(
          player.userName,
          gameState.gameName,
          questions[questionIndex % questions.length].points
        );
    } else {
      alert("Wrong answer");
      if (player && gameState)
        groupIncorrectAnswerSignal(player.userName, gameState.gameName);
    }
  };

  if (buzzedIn) {
    setTimeout(() => {
      if (!incorrect) {
        setBuzzIn(false);
      }
    }, 5000);
  }

  let disable: boolean;
  if (incorrect || buzzedIn) disable = true;
  return (
    <div>
      <Typography variant="h4" mb="30px" className="generalHeading">
        {gameState?.gameName}
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
      </Box>

      {gameJoinedOnHub && !isLoading && (
        <QuestionBox
          onClick={incrementSignal}
          questions={questions}
          questionIndex={questionIndex}
        />
      )}

      {gameJoinedOnHub &&
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
                buzzedInPlayer == mappedPlayer.userName && (
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
