import { createContext, PropsWithChildren } from "react";
import { signalRConnector } from "./signalRconnection";

interface SignalRContextValue {
  connection: signalRConnector;
}

export const SignalRContext = createContext<SignalRContextValue>({
  connection: signalRConnector.getInstance(),
});

export function SignalRProvider({ children }: PropsWithChildren<unknown>) {
  const connection = signalRConnector.getInstance();

  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
}
