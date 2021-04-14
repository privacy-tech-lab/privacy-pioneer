import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useHistory, useLocation } from "react-router-dom"

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

const configureScrollPosition = (history, location) => {
  if (history.action === "POP" && location.pathname === history.location.pathname) {
    const pageYOffset = window.sessionStorage.getItem(`pageYOffset-${location.pathname}`) ?? 0
    window.sessionStorage.removeItem(`pageYOffset-${history.location.pathname}`)
    window.scrollTo(0, pageYOffset)
  } else if (history.action === "PUSH" && location.pathname === history.location.pathname ) {
    window.scrollTo(0, 0)
  } else if (history.action === "PUSH" && location.pathname !== history.location.pathname) {
    window.sessionStorage.setItem(`pageYOffset-${location.pathname}`, window.pageYOffset)
  }
}

const Scaffold = (props) => {
  const history = useHistory()
  const location = useLocation()

  return (
    <SScaffold
      initial={{ opacity: 0 }}
      animate={{opacity: 1}}
      exit={{ opacity: 0 }}
      transition={{ duration: .25, type: "tween", ease: "easeOut" }}
      onAnimationStart={() => configureScrollPosition(history, location)}
    >
      {props.children}
    </SScaffold>
  )
}

export default Scaffold
