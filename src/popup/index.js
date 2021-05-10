import React from "react"
import ReactDOM from "react-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import GlobalStyle from "../libs/global-style"
import { HashRouter as Router } from "react-router-dom"
import AppView from "./views/app-view"

/**
 * Entry point to react app
 * Set router and inject global style to be used throughout the app
 */
ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle popup />
    <Router>
      <AppView />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)
