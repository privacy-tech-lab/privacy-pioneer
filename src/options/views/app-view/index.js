/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

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
import ReactHintFactory from "react-hint"
import "react-hint/css/index.css"
import styled from "styled-components"

const SHint = styled.div`
  padding: 8px;
  border-radius: 5px;
  background: var(--primaryBrandColor);
  font-size: var(--body1);
  text-align: center;
  width: max-content;
  color: white;
  max-width: ${(props) => (props.multiline ? "350px" : "none")};
`

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
      <ReactHint
        attribute="data-custom"
        position="bottom"
        events={{ hover: true }}
        delay={{ show: 300 }}
        onRenderContent={(target, content) => {
          return (
            <SHint multiline={target.dataset.customMultiline}>
              {target.dataset.customInfo}
            </SHint>
          )
        }}
      />
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
