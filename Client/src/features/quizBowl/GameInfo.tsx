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

interface Props {
  finished: boolean;
}
export default function GameInfo({ finished }: Props) {
  const { player, gameState } = useAppSelector((state) => state.quiz);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      {gameState && !finished && (
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
      {gameState && finished && (
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
            <Typography variant="h6" className="cardHeadingDetails">
              Max Players: {gameState.maxPlayers}
            </Typography>
          </Card>
        </Box>
      )}{" "}
    </Container>
  );
}
