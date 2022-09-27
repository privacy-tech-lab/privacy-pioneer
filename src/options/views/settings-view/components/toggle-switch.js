/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

export const SSwitch = styled.div`
  display: flex;
  cursor: pointer;
  align-self: center;
  width: 60px;
  height: 30px;
  border-radius: 16px;
  background-color: ${(prop) => (prop.active ? "#6b219f" : "#949494")};
`;

export const SKnob = styled(motion.div)`
  height: 80%;
  aspect-ratio: 1/1;
  background-color: white;
  border-radius: 50%;
  align-self: center;
  margin: 0px 4px;
`;

export const SSwitchLabel = styled.div`
  font-size: var(--title2);
  font-weight: 400;
  align-self: center;
  margin-right: 24px;
`;
/**
 * General Toggle Switch used in various settings sections
 */
export const ToggleSwitch = ({ isActive, label, onClick, spaceBetween }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      margin: "12px 8px 12px 0px",
      justifyContent: spaceBetween ? "space-between" : null,
    }}
  >
    <SSwitchLabel>{label}</SSwitchLabel>
    <SSwitch active={isActive} onClick={onClick}>
      <SKnob
        variants={{
          off: { x: 0 },
          on: { x: 28 },
        }}
        transition={{ type: "tween" }}
        initial={isActive ? "on" : "off"}
        animate={isActive ? "on" : "off"}
      />
    </SSwitch>
  </div>
);
