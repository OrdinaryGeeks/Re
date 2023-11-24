import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import HomePage from "../../features/home/HomePage";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";

import Lobby from "../../features/quizBowl/Lobby";
import CreateGame from "../../features/quizBowl/CreateGame";
import Winner from "../../features/quizBowl/Winner";
import Loser from "../../features/quizBowl/Loser";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";

import QuizBowlHooks from "../../features/quizBowl/QuizBowlHooks";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/game", element: <QuizBowlHooks /> },
      { path: "/lobby", element: <Lobby /> },
      { path: "/createGame", element: <CreateGame /> },
      { path: "/winner", element: <Winner /> },
      { path: "/loser", element: <Loser /> },
      { path: "/server-error", element: <ServerError /> },
      { path: "/not-found", element: <NotFound /> },

      { path: "/register", element: <Register /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
