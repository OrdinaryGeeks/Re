import { Box, Card, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function Winner() {
  return (
    <Card className="generalHeading">
      <Box
        component="img"
        className="generalHeading"
        sx={{
          height: 233,
          width: 350,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        alt="You should try out for Jeopardy!!"
        src="/winner.jpg"
      />
      <Typography className="generalHeading" variant="h2">
        You Win!
      </Typography>
      <NavLink to={"/Lobby"}>Lobby</NavLink>
    </Card>
  );
}
