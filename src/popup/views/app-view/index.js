import React from "react"
import { Route, Switch, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import WebsiteView from "../website-view"
import LabelView from "../label-view"

const AppView = () => {
  const location = useLocation()
  return (
    <AnimatePresence initial={false}>
      <Switch location={location} key={location.pathname}>
        <Route path="/" exact component={WebsiteView} />
        <Route path="/website/:website/label/:label" component={LabelView} />
      </Switch>
    </AnimatePresence>
  )
}

export default AppView
