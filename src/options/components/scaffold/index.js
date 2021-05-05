import React, { useEffect } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useHistory, useLocation } from "react-router-dom"

/**
 * Generally this would be in a style.js file
 * Since it belongs to such a simple component, it's here.
 */
const SScaffold = styled(motion.main)`
  max-width: 1192px;
  width: calc(100% - 128px);
  margin-left: 64px;
  margin-right: 64px;
  margin-top: 16px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
`

/**
 * Implements the basic deisgn visual layout stucture.
 * This is the like the main div for each page (aka each component in view besides AppView).
 * It handles animations from page to page
 */
const Scaffold = (props) => {
  const history = useHistory()
  const location = useLocation()

  /**
   * This is an attempt to restore scroll position when navigating between pages using session storage
   * I haven't tried to see if the default scroll restoration works with hash router
   * So you could comment out this fuction and see if navigating between scrolling pages correctly restores
   * I don't think it's working perfectly at the moment
   */
  const configureScrollPosition = (history, location) => {
    if (history.action === "POP" && location.pathname === history.location.pathname) {
      const pageYOffset = window.sessionStorage.getItem(`pageYOffset-${location.pathname}`) ?? 0
      window.sessionStorage.removeItem(`pageYOffset-${history.location.pathname}`)
      window.scrollTo(0, pageYOffset)
    } else if (history.action === "PUSH" && location.pathname === history.location.pathname) {
      window.scrollTo(0, 0)
    } else if (history.action === "PUSH" && location.pathname !== history.location.pathname) {
      window.sessionStorage.setItem(`pageYOffset-${location.pathname}`, window.pageYOffset)
    }
  }

  return (
    <SScaffold
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, type: "tween", ease: "easeOut" }}
      onAnimationStart={() => configureScrollPosition(history, location)}
    >
      {props.children}
    </SScaffold>
  )
}

export default Scaffold
