import { Container, CssBaseline, Box, Card } from "@mui/material";

export default function contactPage() {
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
        <Card sx={{ marginTop: 30 }}>Email : Alecto_perfecto@hotmail.com</Card>
      </Box>
    </Container>
  );
}
