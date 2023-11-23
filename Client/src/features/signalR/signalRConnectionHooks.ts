import { HubConnectionBuilder } from "@microsoft/signalr";

const hubURL = import.meta.env.VITE_HUB_URL;

export const signalRConnection = new HubConnectionBuilder()
  .withUrl(hubURL)
  .withAutomaticReconnect()
  .build();
