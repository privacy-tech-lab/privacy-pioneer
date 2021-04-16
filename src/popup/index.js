import React from "react"
import ReactDOM from "react-dom"
import GlobalStyle from "../libs/global-style"
import { HashRouter as Router } from "react-router-dom"
import AppView from "./views/app-view"

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle popup />
    <Router>
      <AppView />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)
