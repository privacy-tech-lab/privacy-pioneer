import React, { useEffect, useState } from "react"
import { Route, Switch, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import NavBar from "./components/nav-bar"
import HomeView from "../home-view"
import WatchlistView from "../watchlist-view"
import AboutView from "../about-view"
import SettingsView from "../settings-view"
import SearchView from "../search-view"
import GlobalStyle from "../../../libs/global-style"
import { getTheme, settingsEnum } from "../../../libs/settings"
import ReactTooltip from "react-tooltip"
import ReactHintFactory from "react-hint"
import "react-hint/css/index.css"

/**
 * Root node of application that handles routing
 * With the help of AnimatePresence from 'Framer Motion' we can animate between route changes
 *  See Scaffold component for specific animation
 */
const AppView = () => {
  const location = useLocation()
  const [theme, setTheme] = useState(settingsEnum.sameAsSystem)
  const ReactHint = ReactHintFactory(React)

  useEffect(
    () =>
      getTheme().then((res) => {
        if (res) setTheme(res)
      }),
    [theme]
  )

  return (
    <React.Fragment>
      <ReactHint position="bottom" events delay={{ show: 300 }} />
      <GlobalStyle theme={theme} />
      <NavBar />
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
          <Route path="/" exact component={HomeView} />
          <Route path="/watchlist" component={WatchlistView} />
          <Route
            path="/settings"
            render={() => <SettingsView changeTheme={setTheme} />}
          />
          <Route path="/about" component={AboutView} />
          <Route path="/search" component={SearchView} />
        </Switch>
      </AnimatePresence>
    </React.Fragment>
  )
}

export default AppView
