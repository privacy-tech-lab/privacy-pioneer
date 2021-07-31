/*
Licensed per https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useState, useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import WebsiteView from "../website-view";
import LabelView from "../label-view";
import GlobalStyle from "../../../libs/global-style";
import { getTheme, settingsEnum } from "../../../libs/settings";

/**
 * Root node of application that handles routing
 * With the help of AnimatePresence from 'Framer Motion' we can animate between route changes
 *  See Scaffold component for specific animation
 */
const AppView = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(settingsEnum.sameAsSystem);

  useEffect(
    () =>
      getTheme().then((res) => {
        if (res) setTheme(res);
      }),
    [theme]
  );
  return (
    <React.Fragment>
      <GlobalStyle theme={theme} popup />
      <AnimatePresence initial={false}>
        <Switch location={location} key={location.pathname}>
          <Route path="/" exact component={WebsiteView} />
          <Route path="/website/:website/label/:label" component={LabelView} />
        </Switch>
      </AnimatePresence>
    </React.Fragment>
  );
};

export default AppView;
