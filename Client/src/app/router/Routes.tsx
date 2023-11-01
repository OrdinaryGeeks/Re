import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import HomePage from "../../features/home/HomePage";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";

import GamePage from "../../features/Game/GamePage";
import Lobby from "../../features/quizBowl/Lobby";
import CreateGame from "../../features/quizBowl/CreateGame";
import Winner from "../../features/quizBowl/Winner";
import Loser from "../../features/quizBowl/Loser";

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
      { path: "/game", element: <GamePage /> },
      { path: "/lobby", element: <Lobby /> },
      { path: "/createGame", element: <CreateGame /> },
      { path: "/winner", element: <Winner /> },
      { path: "/loser", element: <Loser /> },
    ],
  },
]);
