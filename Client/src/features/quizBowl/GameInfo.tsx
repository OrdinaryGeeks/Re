import {
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material";

import { leaveGame } from "./quizSlice";

import { useAppDispatch, useAppSelector } from "../../app/Store/configureStore";

import { Player } from "./Player";
import { useNavigate } from "react-router-dom";

export default function GameInfo() {
  const { player, gameState } = useAppSelector((state) => state.quiz);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //mouse handler that will disassociate the player from gameState information
  //need to hook up signalr connection to alert other users

  function LeaveGame() {
    if (player) {
      const newPlayer: Player = {
        ...player,
        gameName: "",
        gameStateId: null,

        ready: false,
        nextQuestion: false,
      };
      dispatch(leaveGame(newPlayer));
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {gameState &&
        (gameState.status == "Starting" || gameState.status == "Lobby") && (
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
      {gameState &&
        (gameState.status == "Winner" || gameState.status == "Loser") && (
          <Box sx={{ mt: 1 }}>
            <Card>
              <Typography variant="h4" className="generalHeading2">
                Your Last Game
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
            </Card>
          </Box>
        )}{" "}
    </Container>
  );
}
