import React from "react"
import ReactDOM from "react-dom"
import AppView from "./views/app-view"
import GlobalStyle from "../libs/global-style"
import { HashRouter as Router } from "react-router-dom"

/**
 * Entry point to react app
 * Set router and inject global style to be used throughout the app
 */
ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Router hashType={"noslash"}>
      <AppView />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)
