import React from "react"
import Home from "./Home"
import Info from "./Info"
import { Route, Switch, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Watchlist from "./Watchlist"

export default () => {
  const location = useLocation()
  return (
    <AnimatePresence initial={false}>
      <Switch location={location} key={location.pathname}>
        <Route path="/info" component={Info} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/" component={Home} />
      </Switch>
    </AnimatePresence>
  )
}
