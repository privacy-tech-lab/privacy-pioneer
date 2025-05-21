/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import WebsiteView from "../website-view";
import { LabelView } from "../label-view";
import GlobalStyle from "../../../libs/global-style";
import { getTheme, settingsEnum } from "../../../libs/indexed-db/settings";

/**
 * Root node of application that handles routing
 * With the help of AnimatePresence from 'Framer Motion' we can animate between route changes
 *  See Scaffold component for specific animation
 */
const AppView = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(settingsEnum.dark);

  useEffect(
    () =>
    //@ts-ignore
      getTheme().then((res) => {
        if (res) setTheme(res);
      }),
    [theme]
  );
  return (
    <React.Fragment>
      <GlobalStyle theme={theme} popup />
      <AnimatePresence initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<WebsiteView />} />
          <Route path="/website/:website/label/:label" element={<LabelView />} />
        </Routes>
      </AnimatePresence>

      

    </React.Fragment>
  );
};

export default AppView;