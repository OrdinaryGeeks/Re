import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes.tsx";
import { store } from "./app/Store/configureStore.ts";
import { Provider } from "react-redux";
import { SignalRProvider } from "./features/signalR/signalRContext.tsx";

console.log("Main");
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SignalRProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </SignalRProvider>
  </React.StrictMode>
);
