import Typography from "@mui/material/Typography";

import QuizBowl from "../quizBowl/QuizBowl";
import { Container, CssBaseline, Box } from "@mui/material";
import { useEffect } from "react";
import { useAppSelector } from "../../app/Store/configureStore";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { player } = useAppSelector((state) => state.quiz);
  /* const players: Player[] = [
    { userName: "Alecto", score: 0 },
    { userName: "BigBoog", score: 0 },
  ];
  const gameState: GameState = {
    gameId: "0",
    players: players,
    status: "Lobby",
  };*/

  //<QuizBowl gameId={gameState.gameId} players={gameState.players} />

  useEffect(() => {
    if (!player) navigate("/Lobby");
  }, [player, navigate]);
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
        <Typography variant="h4">React Quiz Bowl App</Typography>
        <QuizBowl></QuizBowl>
      </Box>
    </Container>
  );
}
