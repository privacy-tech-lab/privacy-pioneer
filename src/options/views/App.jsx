import React from "react"
import styled from "styled-components"
import logo from "../../assets/icon-48.png"
import { Route, Switch, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { RadarIcon, SettingsIcon, HomeIcon, InfoIcon } from "../../components/Icons"
import Home from "./Home"
import Info from "./Info"

const NavBar = styled.nav`
  display: flex;
  max-width: 1192px;
  width: calc(100% - 128px);
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-left: 64px;
  margin-right: 64px;
  position: -webkit-sticky;
  position: sticky;
  top: 0px;
  background-color: var(--secondaryBackgroundColor);
  z-index: 1;

  .leading {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
    align-items: center;
  }

  .brand-icon {
    margin-right: 16px;
  }

  .brand-title {
    font-size: var(--headline);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .trailing {
    display: flex;
    flex-direction: row;
  }

  .trailing > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 16px;
    cursor: pointer;
    font-weight: bold;
    svg {
      margin-right: 4px;
    }
    :hover {
      filter: brightness(0.75);
    }
    :active {
      filter: brightness(1.25);
    }
  }

  .unselected {
    color: gray;
    path,
    circle {
      fill: gray;
    }
  }

  .selected {
    color: var(--primaryBrandColor);
    path,
    circle {
      fill: var(--primaryBrandColor);
    }
  }

  @media (prefers-color-scheme: dark) {
    .selected {
      color: var(--primaryBrandTintColor);
      path,
      circle {
        fill: var(--primaryBrandTintColor);
      }
    }
  }
`

export default () => {
  const location = useLocation()
  return (
    <>
      <NavBar>
        <div className="leading">
          <img className="brand-icon" height="36px" width="36px" src={logo} alt="Logo" />
          <div className="brand-title">Integrated Privacy Analysis</div>
        </div>
        <div className="trailing">
          <div className="selected">
            <HomeIcon size="24px" />
            Home
          </div>
          <div className="unselected">
            <RadarIcon size="20px" />
            Watchlist
          </div>
          <div className="unselected">
            <SettingsIcon size="24px" />
            Settings
          </div>
          <div className="unselected">
            <InfoIcon size="24px" />
            About
          </div>
        </div>
      </NavBar>
      <AnimatePresence exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
        <Route path="/info" component={Info} />
          <Route path="/" component={Home} />
        </Switch>
      </AnimatePresence>
    </>
  )
}
