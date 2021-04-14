import React from "react"
import { Route, Switch, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import WebsiteView from "../website-view"
import LabelView from "../label-view"
import WatchlistView from "../watchlist-view"

const AppView = () => {
  const location = useLocation()
  return (
    <AnimatePresence initial={false}>
      <Switch location={location} key={location.pathname}>
        <Route path="/popup.html" exact component={WebsiteView} />
        <Route path="/popup.html/website/:website/label/:label" component={LabelView} />
        <Route path="/popup.html/watchlist" component={WatchlistView} />
      </Switch>
    </AnimatePresence>
  )
}

export default AppView
