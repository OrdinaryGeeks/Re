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
//import { createSignalRContext } from "react-signalr/signalr";

//const SignalRContext = createSignalRContext();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
