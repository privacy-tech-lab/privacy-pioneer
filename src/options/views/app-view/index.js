/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import NavBar from "./components/nav-bar";
import HomeView from "../home-view";
import WatchlistView from "../watchlist-view";
import AboutView from "../about-view";
import SettingsView from "../settings-view";
import SearchView from "../search-view";
import GlobalStyle from "../../../libs/global-style";
import { getTheme, settingsEnum } from "../../../libs/indexed-db/settings";
import ReactTooltip from "react-tooltip";

/**
 * Root node of application that handles routing
 * With the help of AnimatePresence from 'Framer Motion' we can animate between route changes
 * See Scaffold component for specific animation
 */
const AppView = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(settingsEnum.dark);

  useEffect(() => {
    getTheme().then((res) => {
      if (res) setTheme(res);
    });
  }, [theme]);

  return (
    <React.Fragment>
      <GlobalStyle theme={theme} />
      <ReactTooltip
        className="reactTooltip"
        delayShow={400}
        backgroundColor="var(--primaryBrandColor)"
        textColor="var(--primaryBrandTintColor)"
        effect="solid"
        multiline
      />
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
  );
};

export default AppView;
