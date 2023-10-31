import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./app/layout/Header";
import { Outlet } from "react-router-dom";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header />
        <Outlet />
      </ThemeProvider>
    </div>
  );
}

export default App;
