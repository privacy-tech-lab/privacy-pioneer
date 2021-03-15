import React from "react"
import ReactDOM from "react-dom"
import AppView from "./views/AppView"
import "../styles.css"
import { ChevronRightIcon } from "../components/Icons"

ReactDOM.render(
  <React.StrictMode>
    <AppView />
    <ChevronRightIcon />
  </React.StrictMode>,
  document.getElementById("root")
)
