import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useState } from "react";

/**
 * Start/Stop the provided hub connection (on connection change or when the component is unmounted)
 * @param {HubConnection} hubConnection The signalR hub connection
 * @return {HubConnection} the current signalr connection
 * @return {any} the signalR error in case the start does not work
 */
export function useHub(hubConnection?: HubConnection) {
  const [hubConnectionState, setHubConnectionState] =
    useState<HubConnectionState>(
      hubConnection?.state ?? HubConnectionState.Disconnected
    );
  const [error, setError] = useState();

  useEffect(() => {
    console.log("useHub useEffect");
    setError(undefined);

    if (!hubConnection) {
      console.log("!hubconnectoin");
      setHubConnectionState(HubConnectionState.Disconnected);
      return;
    }

    //if (hubConnection.state !== hubConnectionState)
    {
      setHubConnectionState(hubConnection.state);
    }

    let isMounted = true;
    const onStateUpdatedCallback = () => {
      if (isMounted) {
        console.log("ismountedonstateupdated");
        setHubConnectionState(hubConnection?.state);
      }
    };
    hubConnection.onclose(onStateUpdatedCallback);
    hubConnection.onreconnected(onStateUpdatedCallback);
    hubConnection.onreconnecting(onStateUpdatedCallback);

    if (hubConnection.state === HubConnectionState.Disconnected) {
      console.log(hubConnection.baseUrl);
      console.log(hubConnection);
      const startPromise = hubConnection
        .start()
        .then(onStateUpdatedCallback)
        .catch((reason) => setError(reason));
      onStateUpdatedCallback();

      return () => {
        startPromise.then(() => {
          console.log("returning in usehub");
          //  hubConnection.stop();
        });
        isMounted = false;
      };
    }

    //  return () => {
    // hubConnection.stop();
    //   };
  }, [hubConnection]);

  return { hubConnectionState, error };
}
