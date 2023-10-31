import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { useAppDispatch } from "../../app/Store/configureStore";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { signInUser } from "../account/accountSlice";

export default function CreateGame() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched",
  });

  //const { user } = useAppSelector((state) => state.account);
  const dispatch = useAppDispatch();
  async function submitForm(data: FieldValues) {
    await dispatch(signInUser(data));
    //    await dispatch(signInUser(data));
    //  navigate("/");
  }

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
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome to the lobby
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(submitForm)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Game Name"
            {...register("gameName", { required: "Game Name is Required" })}
            error={!!errors.gameName}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Score To Win"
            {...register("scoreToWin", {
              required: "Score To Win is Required",
            })}
            error={!!errors.scoreToWin}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Max Players"
            {...register("maxPlayers", { required: "Max Players is Required" })}
            error={!!errors.maxPlayers}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isValid}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
