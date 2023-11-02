import { Box, Card, Typography, Button } from "@mui/material";
import { GameState } from "./GameState";

import { useAppSelector, useAppDispatch } from "../../app/Store/configureStore";
import { getUsersInGame, joinGame } from "./quizSlice";

import { useNavigate } from "react-router-dom";

interface Props {
  game: GameState;
}
export default function GameDetails({ game }: Props) {
  const { player } = useAppSelector((store) => store.quiz);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //talks to database in dispatch and associates the gamestate id with the player
  //It then retrieves a copy of the users in the game
  async function JoinGame(joinGameState: GameState) {
    // console.log(joinGameState);
    if (player && joinGameState) {
      const newPlayer = {
        ...player,
        gameStateId: joinGameState.id,
        gameName: joinGameState.gameName,
      };

      //This associates a player with the selected gameStateId then updates the usersInGame
      await dispatch(joinGame([newPlayer, joinGameState])).then(
        async () => await dispatch(getUsersInGame(joinGameState.id))
      );
    }
    //travel to Game page with associated state
    navigate("/Game");
  }

  return (
    <Box mb="30px" key={game.gameName}>
      <Card>
        <Typography variant="h6">Game Name: {game.gameName}</Typography>
        <Typography variant="h6">Game Status: {game.status}</Typography>
        <Typography variant="h6">Target Score: {game.scoreToWin}</Typography>

        <Button onClick={() => JoinGame(game)}>Join Game</Button>
      </Card>
    </Box>
  );
}
