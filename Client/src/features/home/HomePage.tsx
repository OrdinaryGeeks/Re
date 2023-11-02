import { Container, CssBaseline, Box, Card, Paper } from "@mui/material";
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
        <Card>
          <img src="/logo1.png" height="300px" width="300px" />
        </Card>
        <Typography variant="h6">Ordinary Geeks React Site</Typography>

        <Paper elevation={3} sx={{ marginTop: 10 }}>
          <Typography variant="body1">
            Quiz Bowl from Ordinary Geeks is a React, SignalR, Asp.Net Core
            project that uses Identity JWT tokens, React Redux Toolkit, and SQL
            server. The signalR websockets and a react front end help simulate a
            simple quiz game. It is in early stages but is approcahing demo
            status.
          </Typography>

          <Typography variant="h4">How to traverse the website -</Typography>
          <Typography variant="body1">
            Register. Then you will be taken to the Sign in screen. Sign in with
            the name you registered with. In the lobby, you have to get your
            player handle (username) that you signed up with. You then have an
            option to create a game yourself or to join someone else's game, (if
            there are any extra games that have not been started).
          </Typography>
          <Typography variant="body1">
            In the game, you and opponents, (who can also be you if you open up
            two browsers), can answer questions to score points. A buzz in will
            block your opponent from buzzing in. Any player can skip to the next
            question.
          </Typography>
          <Typography variant="h4">TO DO</Typography>
        </Paper>
      </Box>
    </Container>
  );
}
