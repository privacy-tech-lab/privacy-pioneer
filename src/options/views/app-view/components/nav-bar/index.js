import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router"
import logo from "../../../../../assets/icon-48.png"
import * as Icons from "../../../../../libs/icons"
import { SNavBar, SLeading, SBrandIcon, SBrandTitle, STrailing, SNavAction, SLeadingContainer } from "./style"

const NavBar = () => {
  const history = useHistory()
  const location = useLocation()
  const [tab, setTab] = useState(0)

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
      <SLeading>
        <SLeadingContainer onClick={() => configureRoute("/")}>
          <SBrandIcon src={logo} alt="Logo" />
          <SBrandTitle>Integrated Privacy Analysis</SBrandTitle>
        </SLeadingContainer>
      </SLeading>
      <STrailing>
        <SNavAction active={tab === 0} onClick={() => configureRoute("/")}>
          <Icons.Home size="24px" />
          Home
        </SNavAction>
        <SNavAction active={tab === 1} onClick={() => configureRoute("/watchlist")}>
          <Icons.Radar size="20px" />
          Watchlist
        </SNavAction>
        <SNavAction active={tab === 2} onClick={() => configureRoute("/settings")}>
          <Icons.Settings size="24px" />
          Settings
        </SNavAction>
        <SNavAction active={tab === 3} onClick={() => configureRoute("/about")}>
          <Icons.Info size="24px" />
          About
        </SNavAction>
      </STrailing>
    </SNavBar>
  )
}

export default NavBar
