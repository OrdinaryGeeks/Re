import { Card, Container, CssBaseline, Typography } from "@mui/material";

import { useAppSelector } from "../../app/Store/configureStore";

export default function PlayerDetails() {
  const { player, gameState } = useAppSelector((state) => state.quiz);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {player && (
        <Card>
          <Typography variant="h4" className="generalHeading">
            Player Details
          </Typography>
          <Typography variant="h6" className="cardHeadingDetails">
            UserName : {player.userName}
          </Typography>
          {gameState && (
            <div>
              <Typography variant="h6" className="cardHeadingDetails">
                Game Name : {player.gameName}
              </Typography>
              <Typography variant="h6" className="cardHeadingDetails">
                Player Score : {player.score}
              </Typography>
            </div>
          )}
        </Card>
      )}
    </Container>
  );
}
