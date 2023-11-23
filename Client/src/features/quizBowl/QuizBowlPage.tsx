/* import { Button, Container } from "@mui/material";
import { useState, useContext, useRef, useEffect } from "react";
import { SignalRContext } from "../signalR/signalRContext";

import { GameState } from "./GameState";
import { Player } from "./Player";
 */
export default function QuizBowlPage() {
  /* const connection = useContext(SignalRContext);
  //const [toggle, setToggle] = useState("Closed");
  //const [messageIndex, setMessageIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    gameName: "boos game",
    id: 1,
    status: "Lobby",
    scoreToWin: 300,
    maxPlayers: 3,
    questionIndex: 0,
    messageIndex: 0,
  });
  const player: Player = {
    id: 1,
    gameName: "boo",
    userName: "boo",
    gamesJoined: "",
    gameStateId: 1,
    incorrect: false,
    ready: false,
    nextQuestion: false,
    score: 0,
    email: "boo@boo.com",
  };
  const { playerAddedToGameEvent, createOrJoinGroupSignal } =
    connection.connection;

  const messageIndexRef = useRef(0);

  console.log(messageIndexRef.current);

  useEffect(() => {
    playerAddedToGameEvent(
      (_, tempGameState: GameState, tempMessageIndex: number) => {
        // if (messageIndexRef.current <= tempMessageIndex) {
        console.log("inside PATGE");
        console.log(tempMessageIndex);
        console.log(messageIndexRef.current + " " + tempMessageIndex);
        // console.log(playerTemp);
        //console.log(tempGameState);
        // messageIndexRef.current++;

        setGameState(tempGameState);
      } // else setMessageIndex(tempMessageIndex);
      //   }
    );
  });
  console.log("Quiz Bowl Page");
  function ToggleState() {
    // if (toggle == "Open") setToggle("Closed");
    //  else setToggle("Open");

    createOrJoinGroupSignal(gameState, player);
  }

  return (
    <Container>
      <Button onClick={ToggleState}>toggle</Button>
    </Container>
  );*/
}
