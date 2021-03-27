import React from "react"
import ReactDOM from "react-dom"
import App from "./views/App"
import GlobalStyle from "../components/GlobalStyle"
import { BrowserRouter as Router } from "react-router-dom"

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle popup />
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
)
