import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useHistory } from "react-router-dom"

const Scaffold = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
`
export default ({ navigationBar, body }) => {
  let inital, animate, exit

  if (useHistory().action === "PUSH") {
    inital = {position: "fixed", opacity: 0, x: "75%", transitionEnd: { position: "absolute" } }
    animate = {position: "fixed", opacity: 1, x: "0%", transitionEnd: { position: "absolute" } }
    exit = {position: "absolute",  opacity: 0, x: "-75%" }
  } else {
    inital = {position: "absolute", opacity: 0, x: "-75%", transitionEnd: { position: "absolute" } }
    animate = {position: "absolute", opacity: 1, x: "0%", transitionEnd: { position: "absolute" } }
    exit = {position: "fixed",  opacity: 0, x: "75%" }
  }

  return (
    <Scaffold
      initial={inital}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.25, type: "tween", ease: "easeOut" }}
    >
      {navigationBar}
      {body}
    </Scaffold>
  )
}
