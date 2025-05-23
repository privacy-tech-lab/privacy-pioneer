/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../../../assets/logos/Rocket.svg";
import { settingsModelsEnum } from "../../../../../background/analysis/classModels";
import * as Icons from "../../../../../libs/icons";
import { handleClick } from "../../../../../libs/indexed-db/getAnalytics";
import { getAnalyticsStatus } from "../../../../../libs/indexed-db/settings";
import {
  SNavBar,
  SLeading,
  SBrandIcon,
  SBrandTitle,
  STrailing,
  SNavAction,
  SLeadingContainer,
} from "./style";

/**
 * Navigation bar that allows navigating between home, watchlist, settings, and about
 * Displays logo and title
 */
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(0);

  /**
   * Navigates/pushes a new route based on `path`
   * Nothing happens if we are on the root page of the tabbed navigation
   */
  const configureRoute = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };
  useEffect(() => {
    const p = location.pathname;
    if (p.includes("/watchlist")) {
      setTab(1);
    } else if (p.includes("/settings")) {
      setTab(2);
    } else if (p.includes("/about")) {
      setTab(3);
    } else {
      setTab(0);
    }
  }, [location.pathname]);

  return (
    <SNavBar>
      <SLeading>
        <SLeadingContainer
          onClick={() => {
            configureRoute("/");
            const getAnalysis = async () => {
              const status = await getAnalyticsStatus();
              if (status == true) {
                handleClick(
                  "Privacy Pioneer Logo",
                  "Nav-Bar",
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable
                ); // Privacy Pioneer Logo (Brings back to Home page)
              }
            };
            getAnalysis();
          }}
        >
          <SBrandIcon src={logo} alt="Logo" />
          <SBrandTitle>Privacy Pioneer</SBrandTitle>
        </SLeadingContainer>
      </SLeading>
      <STrailing id="navbarTour">
        <SNavAction
          active={tab === 0}
          onClick={() => {
            configureRoute("/");
            const getAnalysis = async () => {
              const status = await getAnalyticsStatus();
              if (status == true) {
                handleClick(
                  "Home Button",
                  "Nav-Bar",
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable
                );
              }
            };
            getAnalysis();
          }}
          data-place="bottom"
          data-tip="See your recent browsing history and all generated labels"
        >
          <Icons.Home size="24px" />
          Home
        </SNavAction>
        <SNavAction
          active={tab === 1}
          onClick={() => {
            configureRoute("/watchlist");
            const getAnalysis = async () => {
              const status = await getAnalyticsStatus();
              if (status == true) {
                handleClick(
                  "Watchlist",
                  "Nav-Bar",
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable
                );
              }
            };
            getAnalysis();
          }}
          data-place="bottom"
          data-tip="Enter personal keywords that Privacy Pioneer will look out for while you browse"
        >
          <Icons.Radar size="20px" />
          Watchlist
        </SNavAction>
        <SNavAction
          active={tab === 2}
          onClick={() => {
            const getAnalysis = async () => {
              const status = await getAnalyticsStatus();
              if (status == true) {
                handleClick(
                  "Settings",
                  "Nav-Bar",
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable
                );
              }
            };
            getAnalysis();
            configureRoute("/settings");
          }}
          data-place="bottom"
          data-tip="Control Privacy Pioneer’s settings"
        >
          <Icons.Settings size="24px" />
          Settings
        </SNavAction>
        <SNavAction
          active={tab === 3}
          onClick={() => {
            const getAnalysis = async () => {
              const status = await getAnalyticsStatus();
              if (status == true) {
                handleClick(
                  "About",
                  "Nav-Bar",
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable,
                  settingsModelsEnum.notApplicable
                );
              }
            };
            getAnalysis();
            configureRoute("/about");
          }}
          data-place="bottom"
          data-tip="About Privacy Pioneer"
        >
          <Icons.Info size="24px" />
          About
        </SNavAction>
      </STrailing>
    </SNavBar>
  );
};

export default NavBar;
