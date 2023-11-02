import { createContext, PropsWithChildren } from "react";
import signalRconnection from "./signalRconnection";

interface SignalRContextValue {
  connection: signalRconnection;
}

export const SignalRContext = createContext<SignalRContextValue>({
  connection: new signalRconnection(),
});

export function SignalRProvider({ children }: PropsWithChildren<unknown>) {
  const connection = new signalRconnection();
  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
}
