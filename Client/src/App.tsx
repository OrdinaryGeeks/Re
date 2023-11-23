import "./App.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./app/layout/Header";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
    },
  });

  console.log("App");
  return (
    <div>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="bottom-right"
          hideProgressBar
          theme="colored"
        />
        <CssBaseline />
        <Header />
        <Outlet />
      </ThemeProvider>
    </div>
  );
}

export default App;
