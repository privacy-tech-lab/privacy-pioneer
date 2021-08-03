/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react";
import ReactDOM from "react-dom";
import AppView from "./views/app-view";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import GlobalStyle from "../libs/global-style";
import { HashRouter as Router } from "react-router-dom";

/**
 * Entry point to react app
 * Set router and inject global style to be used throughout the app
 */
ReactDOM.render(
  <React.StrictMode>
    <Router hashType={"noslash"}>
      <AppView />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
