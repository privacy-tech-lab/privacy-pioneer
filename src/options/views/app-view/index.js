import React, { useEffect } from "react"
import { Route, Switch, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import NavBar from "./components/nav-bar"
import HomeView from "../home-view"
import WebsiteView from "../website-view"
import WatchlistView from "../watchlist-view"
import AboutView from "../about-view"
import SettingsView from "../settings-view"
import SearchView from "../search-view"

const AppView = () => {
  const location = useLocation()

  return (
    <React.Fragment>
      <NavBar />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route path="/" exact component={HomeView} />
          <Route path="/watchlist" component={WatchlistView} />
          <Route path="/settings" component={SettingsView} />
          <Route path="/about" component={AboutView} />
          <Route path="/search" component={SearchView} />
          <Route path="/website/:website" component={WebsiteView} />
        </Switch>
      </AnimatePresence>
    </React.Fragment>
  )
}

export default AppView
