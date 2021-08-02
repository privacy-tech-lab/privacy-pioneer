/*
Licensed per https://github.com/privacy-tech-lab/integrated-privacy-analysis/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import styled from "styled-components";
import { motion } from "framer-motion";

export const SContainer = styled.section`
  ${(props) => (props.marginTop ? "margin-top: 32px;" : "margin-top: 0px;")}
`;

export const STitle = styled.div`
  font-size: var(--title1);
  font-weight: bold;
`;

export const SSubtitle = styled.div`
  color: var(--secondaryTextColor);
  justify-self: flex-start;
`;

export const SBody = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  justify-content: center;
`;

export const SSection = styled.div`
  display: flex;
  margin-top: 8px;
  flex: 1;
  flex-direction: column;
  justify-content: space-evenly;
`;
export const SSeperator = styled.div`
  display: flex;
  width: 1px;
  margin-left: ${(prop) => prop.marginLeft};
  margin-right: ${(prop) => prop.marginRight};
  background-color: var(--seperatorColor);
  margin-top: ${(prop) => prop.marginTop};
  margin-bottom: ${(prop) => prop.marginBottom};
`;
export const SSwitch = styled.div`
  display: flex;
  cursor: pointer;
  align-self: center;
  width: 60px;
  height: 30px;
  border-radius: 16px;
  background-color: ${(prop) =>
    prop.active ? "var(--primaryBrandColor)" : "#949494"};
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

export const SSettingHeader = styled.div`
  font-size: var(--title2);
  font-weight: bold;
  margin-top: 8px;
`;

export const SLabelToggle = styled.div`
  margin-left: 8px;
  flex-direction: column;
`;
