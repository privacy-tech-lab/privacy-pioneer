/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useHistory } from "react-router-dom";

/**
 * Generally this would be in a style.js file
 * Since it belongs to such a simple component, it's here.
 */
const SScaffold = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

/**
 * Implements the basic deisgn visual layout stucture.
 * This is the like the main div for each page (aka each component in view besides AppView).
 * It handles animations from page to page
 */
const Scaffold = ({ navigationBar, body }) => {
  let inital, animate, exit;

  if (useHistory().action === "PUSH") {
    inital = {
      position: "fixed",
      opacity: 0,
      x: "75%",
      transitionEnd: { position: "absolute" },
    };
    animate = {
      position: "fixed",
      opacity: 1,
      x: "0%",
      transitionEnd: { position: "absolute" },
    };
    exit = { position: "absolute", opacity: 0, x: "-75%" };
  } else {
    inital = {
      position: "absolute",
      opacity: 0,
      x: "-75%",
      transitionEnd: { position: "absolute" },
    };
    animate = {
      position: "absolute",
      opacity: 1,
      x: "0%",
      transitionEnd: { position: "absolute" },
    };
    exit = { position: "fixed", opacity: 0, x: "75%" };
  }

  return (
    <SScaffold
      initial={inital}
      animate={animate}
      exit={exit}
      transition={{ duration: 0.25, type: "tween", ease: "easeOut" }}
    >
      {navigationBar}
      {body}
    </SScaffold>
  );
};

export default Scaffold;
