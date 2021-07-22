import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router"
import ReactTooltip from "react-tooltip"
import logo from "../../../../../assets/icon-48.png"
import * as Icons from "../../../../../libs/icons"
import {
  SNavBar,
  SLeading,
  SBrandIcon,
  SBrandTitle,
  STrailing,
  SNavAction,
  SLeadingContainer,
} from "./style"

/**
 * Navigation bar that allows navigating between home, watchlist, settings, and about
 * Displays logo and title
 */
const NavBar = () => {
  const history = useHistory()
  const location = useLocation()
  const [tab, setTab] = useState(0)

  /**
   * Navigates/pushes a new route based on `path`
   * Nothing happens if we are on the root page of the tabbed navigation
   */
  const configureRoute = (path) => {
    if (history.location.pathname !== path) {
      history.push({ pathname: path })
    }
  }

  useEffect(() => {
    if (history.location.pathname.includes("/watchlist")) {
      setTab(1)
    } else if (history.location.pathname.includes("/settings")) {
      setTab(2)
    } else if (history.location.pathname.includes("/about")) {
      setTab(3)
    } else {
      setTab(0)
    }
  }, [location])

  return (
    <SNavBar>
      <ReactTooltip place="bottom" type="dark" effect="solid" />
      <SLeading>
        <SLeadingContainer onClick={() => configureRoute("/")}>
          <SBrandIcon src={logo} alt="Logo" />
          <SBrandTitle>Integrated Privacy Analysis</SBrandTitle>
        </SLeadingContainer>
      </SLeading>
      <STrailing>
        <SNavAction
          active={tab === 0}
          onClick={() => configureRoute("/")}
          data-tip="See your recent browsing history and all generated labels"
        >
          <Icons.Home size="24px" />
          Home
        </SNavAction>
        <SNavAction
          active={tab === 1}
          onClick={() => configureRoute("/watchlist")}
          data-tip="Enter personal keywords that ___ will look out for while you browse"
        >
          <Icons.Radar size="20px" />
          Watchlist
        </SNavAction>
        <SNavAction
          active={tab === 2}
          onClick={() => configureRoute("/settings")}
          data-tip="Control ___’s settings"
        >
          <Icons.Settings size="24px" />
          Settings
        </SNavAction>
        <SNavAction
          active={tab === 3}
          onClick={() => configureRoute("/about")}
          data-tip="About ____"
        >
          <Icons.Info size="24px" />
          About
        </SNavAction>
      </STrailing>
    </SNavBar>
  )
}

export default NavBar
