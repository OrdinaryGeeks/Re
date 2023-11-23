import { Fragment, useContext, useEffect, useState } from "react";
import { SignalRContext } from "../signalR/signalRContext";

import { Button, Typography } from "@mui/material";
import { useHub } from "../Hub/useHub";
export default function Message() {
  const connection = useContext(SignalRContext);
  const { newMessage, events, events2, newMessage2 } = connection.connection;
  const [message, setMessage] = useState("initial value");
  const [message2, setMessage2] = useState("initial value");

  useHub(connection);
  const messageIndexRef = useRef(0);
  useEffect(() => {
    console.log("in message");
    events((_, message) => setMessage(message));
  });

  useEffect(() => {
    console.log("in message2");
    events2((_, message2) => setMessage2(message2));
  });

  console.log("IN MESSAGE");
  return (
    <Fragment>
      <Typography>message from signalR: {message} </Typography>
      <Typography>message2 from signalR: {message2} </Typography>
      <Button onClick={() => newMessage(new Date().toISOString())}>
        send date{" "}
      </Button>
      <Button onClick={() => newMessage2("boo")}>send date2 </Button>
    </Fragment>
  );
}
