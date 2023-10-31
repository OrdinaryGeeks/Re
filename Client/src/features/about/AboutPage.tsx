import { Container, CssBaseline, Box, Card } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function AboutPage() {
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
          This is a React application that uses Signal R to allow players to
          join a quizbowl match. A .Net Web Api serves up questions and users
          can buzz in first and be the first to answer
        </Card>
      </Box>
    </Container>
  );
}
