/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { MemoryRouter as Router } from "react-router-dom";
import AppView from "./views/app-view";

/**
 * Entry point to react app
 * Set router and inject global style to be used throughout the app
 */
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AppView />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
