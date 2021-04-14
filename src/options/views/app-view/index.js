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
          <Route path="/options.html" exact component={HomeView} />
          <Route path="/options.html/watchlist" component={WatchlistView} />
          <Route path="/options.html/settings" component={SettingsView} />
          <Route path="/options.html/about" component={AboutView} />
          <Route path="/options.html/search" component={SearchView} />
          <Route path="/options.html/website/:website" component={WebsiteView} />
        </Switch>
      </AnimatePresence>
    </React.Fragment>
  )
}

export default AppView
