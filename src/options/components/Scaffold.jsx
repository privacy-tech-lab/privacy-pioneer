import React from "react"
import styled from "styled-components"
import { motion } from "framer-motion"
import { useHistory } from "react-router-dom"

const Scaffold = styled(motion.main)`
  max-width: 1192px;
  width: calc(100% - 128px);
  margin-left: 64px;
  margin-right: 64px;
  margin-top: 16px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
`
export default (props) => {
  let inital, animate, exit

  if (useHistory().action === "PUSH") {
    inital = {opacity: 0}
    animate = {opacity: 1}
    exit = {opacity: 0}
  } else {
    inital = {opacity: 0}
    animate = {opacity: 1}
    exit = {opacity: 0 }
  }

  return (
    <Scaffold
      initial={inital}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.25, type: "tween", ease: "easeOut" }}
    >
      {props.children}
    </Scaffold>
  )
}