import { HubConnection } from "@microsoft/signalr";
import { createContext, PropsWithChildren } from "react";
import { useHub } from "../Hub/useHub";
//import { signalRConnector } from "./signalRconnection";
import {
  signalRConnection,
  //hubConnectionState,
  //error,
} from "./signalRConnectionHooks";
//import { signalRConnector } from "./signalRconnection";
//import { useHub } from "react-use-signalr";

interface SignalRContextValue {
  // connection: signalRConnector;
  connection: HubConnection;
  //hubConnectionState: hubConnectionState;
  //error: error;
}

export const SignalRContext = createContext<SignalRContextValue>({
  connection: signalRConnection,
});

export function SignalRProvider({ children }: PropsWithChildren<unknown>) {
  const connection = signalRConnection;
  //const { hubConnectionState, error } =
  useHub(connection);
  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
}
