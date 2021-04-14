import React from "react"
import ReactDOM from "react-dom"
import AppView from "./views/app-view"
import GlobalStyle from "../libs/global-style"
import { BrowserRouter as Router } from "react-router-dom"

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Router>
      <AppView />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)
