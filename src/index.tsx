import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Providers from "./Providers";
import { SnackbarProvider } from 'notistack';


import "./index.css";
import App from "./App";

import "./i18n";

ReactDOM.render(
  <Router>
    <Providers>
      <SnackbarProvider maxSnack={5}>
        <App />
      </SnackbarProvider>
    </Providers>
  </Router>,
  document.getElementById("root")
);
