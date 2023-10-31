import { Container, CssBaseline, Box, Card } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function HomePage() {
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
        <Typography variant="h6">Ordinary Geeks React Site</Typography>

        <Card sx={{ marginTop: 10 }}>
          Microsoft Identity, SignalR, React, SQL Server
        </Card>
      </Box>
    </Container>
  );
}
