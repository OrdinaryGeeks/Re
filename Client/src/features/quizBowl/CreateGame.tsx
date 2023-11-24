import { Box, Button, Container, CssBaseline, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { createGame } from "./quizSlice";
import { useAppDispatch } from "../../app/Store/configureStore";
import { GameState } from "./GameState";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../app/Store/configureStore";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function CreateGame() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched",
  });
  const dispatch = useAppDispatch();
  const { errorInQuizSlice } = useAppSelector((state) => state.quiz);

  useEffect(() => {
    if (errorInQuizSlice == "Duplicate Game Created")
      toast.error("Duplicate Game Created");
  }, [errorInQuizSlice]);
  async function MakeGame() {
    const gameValues = getValues();

    const userGame: GameState = {
      gameName: gameValues["gameName"],
      scoreToWin: gameValues["targetScore"],

      maxPlayers: 2,
      status: "Lobby",
      id: 0,
      questionIndex: 0,
    };
    await dispatch(createGame(userGame));
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        component="form"
        onSubmit={handleSubmit(MakeGame)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Box>
          Create a game (automatically joining it) and entering the game page or
          navigate back to the lobby
        </Box>
        <TextField
          margin="normal"
          fullWidth
          label="Game Name"
          {...register("gameName", { required: "Gamename is Required" })}
          error={!!errors.gameName}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Target Score"
          {...register("targetScore", {
            required: "Target Score is Required",
          })}
          error={!!errors.targetScore}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!isValid}
        >
          Create Game
        </Button>

        <NavLink to={"/Lobby"}>Return To Lobby</NavLink>
      </Box>
    </Container>
  );
}
