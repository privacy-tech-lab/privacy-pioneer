/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
      <AnimatePresence initial={false} mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomeView />} />
          <Route path="/watchlist" element={<WatchlistView />} />
          <Route path="/settings" element={<SettingsView changeTheme={setTheme} />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/search" element={<SearchView />} />
        </Routes>
      </AnimatePresence>
    </React.Fragment>
  );
};

export default AppView;
