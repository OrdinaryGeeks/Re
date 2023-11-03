import { Box, Container, CssBaseline, Paper } from "@mui/material";

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
        <Paper>
          Ordinary Geeks was officially founded in 2020. It specializes in full
          stack development of .Net Core websites.
        </Paper>
      </Box>
    </Container>
  );
}
