import { Box, Card, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
export default function Loser() {
  return (
    <Card className="generalHeading">
      <Box
        component="img"
        sx={{
          height: 233,
          width: 350,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        alt="You tried!! Thats what matters"
        src="/loser.png"
      />
      <Typography className="generalHeading" variant="h2">
        You tried!! Thats what matters
      </Typography>
      <NavLink to={"/Lobby"}>Lobby</NavLink>
    </Card>
  );
}
