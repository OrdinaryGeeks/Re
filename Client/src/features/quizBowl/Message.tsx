import { Fragment, useContext, useState } from "react";
import { SignalRContext } from "../signalR/signalRContext";
import { Button, Typography } from "@mui/material";
import { useClientMethod } from "../Hub/useClientMethod";

import { useHubMethod } from "../Hub/useHubMethod";

export default function Message() {
  const connection = useContext(SignalRContext);
  //const { newMessage, events, events2, newMessage2 } = connection.connection;
  const [message, setMessage] = useState("initial value");
  //const [message2, setMessage2] = useState("initial value");

  const { invoke, error } = useHubMethod(connection.connection, "NewMessage");

  console.log();
  //const messageIndexRef = useRef(0);

  useClientMethod(connection.connection, "messageReceived", (_, message) => {
    console.log(message);
    setMessage(message[0]);
  });

  /*
  useEffect(() => {
    console.log("in message2");
    events2((_, message2) => setMessage2(message2));
  });
*/
  console.log(error);
  console.log("IN MESSAGE");
  return (
    <Fragment>
      <Typography>message from signalR: {message} </Typography>

      <Button onClick={() => invoke([, new Date().toISOString()])}>
        send date{" "}
      </Button>
    </Fragment>
  );
}
