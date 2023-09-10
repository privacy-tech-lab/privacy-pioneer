/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React from "react";
import { SLeading, SMiddle, SNav, STrailing } from "./style";

/**
 * Toolbar that minimally consists of a component, normally a page title, in the middle of the toolbar.
 * Supports a leading and trailing component before and after the middle component
 *  while keeping the middle component centered
 * @param {object} obj
 * @param {object} [obj.leading]
 * @param {object} [obj.middle]
 * @param {object} [obj.trailing]
 */
const NavBar = ({ leading, middle, trailing }) => {
  return (
    <SNav middle={middle}>
      {leading && <SLeading>{leading}</SLeading>}
      {middle && <SMiddle>{middle}</SMiddle>}
      {(trailing || middle) && (
        <STrailing middle={middle}>{trailing}</STrailing>
      )}
    </SNav>
  );
};

export default NavBar;
