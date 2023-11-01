import {
  Container,
  CssBaseline,
  Box,
  Button,
  TextField,
  Typography,
  Card,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/Store/configureStore";
import {
  createOrGetPlayer,
  createGame,
  leaveGame,
  joinGame,
  getGames,
} from "./quizSlice";
import { Player } from "./Player";
import { GameState } from "./GameState";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//import { PlayerDTO } from "./PlayerDTO";

//import { useNavigate } from "react-router-dom";

export default function Lobby() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched",
  });
  const { user } = useAppSelector((state) => state.account);
  const { player, gameState, gameList } = useAppSelector((state) => state.quiz);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user) navigate("/Login");
  });

  function JoinGame(joinGameState: GameState) {
    dispatch(joinGame(joinGameState)).then(() => navigate("/Game"));
  }
  function LeaveGame() {
    dispatch(leaveGame());
  }

  function GetGamesList() {
    dispatch(getGames());
  }

  async function CreateOrGetPlayer() {
    if (user) {
      const userPlayer: Player = {
        id: 1,
        userName: user.userName,
        email: user.email,
        score: 0,
        gameStateId: null,
        ready: false,
        nextQuestion: false,
        gameName: "",
      };

      console.log(userPlayer);
      await dispatch(createOrGetPlayer(userPlayer));
    }
  }

  async function CreateGame() {
    if (player) {
      const gameValues = getValues();

      const userGame: GameState = {
        gameName: gameValues["gameName"],
        scoreToWin: gameValues["targetScore"],
        maxPlayers: gameValues["maxPlayers"],
        status: "Lobby",
        id: 0,
        questionIndex: 0,
      };
      console.log(userGame);
      await dispatch(createGame(userGame));
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {player && (
          <Card>
            <Typography variant="h4" className="generalHeading">
              Player Details
            </Typography>
            <Typography variant="h6" className="cardHeadingDetails">
              UserName : {player.userName}
            </Typography>
            <Typography variant="h6" className="cardHeadingDetails">
              Game Name : {gameState?.gameName}
            </Typography>
            <Typography variant="h6" className="cardHeadingDetails">
              Player Score : {player.score}
            </Typography>
          </Card>
        )}
        {gameState && (
          <Box sx={{ mt: 1 }}>
            <Card>
              <Typography variant="h4" className="generalHeading2">
                Your Current Game
              </Typography>
              <Typography variant="h6" className="cardHeadingDetails">
                Name: {gameState.gameName}
              </Typography>
              <Typography variant="h6" className="cardHeadingDetails">
                Status: {gameState.status}
              </Typography>
              <Typography variant="h6" className="cardHeadingDetails">
                Target Score: {gameState.scoreToWin}
              </Typography>
              <Typography variant="h6" className="cardHeadingDetails">
                Max Players: {gameState.maxPlayers}
              </Typography>
              <Button onClick={() => LeaveGame()}>Unregister from Game</Button>
              <Button onClick={() => navigate("/Game")}>
                Go to registered Game
              </Button>
            </Card>
          </Box>
        )}
        {player == null && (
          <Box>
            <Typography variant="h6">
              Your player handle for this current session has not been set.
              Please press Set Player Handle to set it to your Identity User
              Name
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isValid}
              onClick={CreateOrGetPlayer}
            >
              Set Player Handle
            </Button>
          </Box>
        )}{" "}
        {player && !gameState && (
          <Box
            component="form"
            onSubmit={handleSubmit(CreateGame)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Box>
              Create a game (automatically joining it) or hit Search Games to
              see list of games you can join and join them. Upon joining a game
              you will enter the game page
            </Box>
            <TextField
              margin="normal"
              fullWidth
              label="Game Name"
              {...register("gameName", { required: "Gamename is Required" })}
              error={!!errors.gameName}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Target Score"
              {...register("targetScore", {
                required: "Target Score is Required",
              })}
              error={!!errors.targetScore}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Max Players"
              {...register("maxPlayers", {
                required: "Max Players is Required",
              })}
              error={!!errors.maxPlayers}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isValid}
            >
              Create Game
            </Button>
          </Box>
        )}
        {player && (
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={GetGamesList}
          >
            Search Games
          </Button>
        )}
        {gameList && (
          <Box>
            {gameList.map((gameFromList: GameState) => (
              <Box mb="30px">
                <Card>
                  <Typography variant="h6">
                    Game Name: {gameFromList.gameName}
                  </Typography>
                  <Typography variant="h6">
                    Game Status: {gameFromList.status}
                  </Typography>
                  <Typography variant="h6">
                    Target Score: {gameFromList.scoreToWin}
                  </Typography>

                  <Button onClick={() => JoinGame(gameFromList)}>
                    Join Game
                  </Button>
                </Card>
              </Box>
            ))}
          </Box>
        )}
        {gameState && (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={LeaveGame}
          >
            Leave Game
          </Button>
        )}
      </Box>
    </Container>
  );
}
