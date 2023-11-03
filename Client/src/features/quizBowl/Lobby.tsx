import { Container, CssBaseline, Box, Button, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/Store/configureStore";
import { leaveGame, getGames } from "./quizSlice";
import { Player } from "./Player";
import { GameState } from "./GameState";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import GameInfo from "./GameInfo";
import PlayerDetails from "./PlayerDetails";
import PlayerHandle from "./PlayerHandle";
import GameDetails from "./GameDetails";

export default function Lobby() {
  const { user } = useAppSelector((state) => state.account);
  const { player, gameState, gameList } = useAppSelector((state) => state.quiz);
  const navigate = useNavigate();
  const [finished, setFinished] = useState(false);
  const dispatch = useAppDispatch();
  const [showGameList, setShowGameList] = useState(false);
  useEffect(() => {
    if (!user) navigate("/Login");
  });

  let ToggleText: string = "Show Game List";
  if (showGameList) ToggleText = "Dont Show Game List";

  //disassociates the player from all quiz related info and updates state
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

  useEffect(() => {
    if (gameState)
      setFinished(
        gameState.status == "Winner" || gameState.status == "Loser"
          ? true
          : false
      );
  }, [gameState]);

  //Used Toggle Show Game List to display Games List
  function ToggleShowGameList() {
    setShowGameList((c) => !c);

    if (showGameList) {
      if (player) dispatch(getGames());
      if (player) ToggleText = "Show Game List";
    } else ToggleText = "Dont Show Game List";
  }

  //always load the games on page reload
  useEffect(() => {
    if (player) dispatch(getGames());
  }, [player, dispatch]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box pr="20px" pl="20px" mb="30px">
          {player && <PlayerDetails />}
        </Box>
        {gameState && finished && <GameInfo finished={finished} />}
        {gameState && !finished && <GameInfo finished={finished} />}
        {gameState && !finished && (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={LeaveGame}
          >
            Leave Game
          </Button>
        )}
        {player == null && <PlayerHandle />}
        {player && (!gameState || finished) && (
          <NavLink to="/CreateGame">
            <Typography variant="h6">Create Game</Typography>
          </NavLink>
        )}
        {player && (
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={ToggleShowGameList}
          >
            {ToggleText}
          </Button>
        )}
        {gameList && showGameList && (
          <Box>
            {gameList.map((gameFromList: GameState) => (
              <GameDetails key={gameFromList.gameName} game={gameFromList} />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
