import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import Providers from "./Providers";

import "./i18n";
// <Router>
{/* </Router> */}

ReactDOM.render(
    <Providers>
      <App />
    </Providers>
  ,
  document.getElementById("root")
);
