/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import { motion } from "framer-motion";
import styled from "styled-components";

export const SContainer = styled.section`
  ${(props) => (props.marginTop ? "margin-top: 32px;" : "margin-top: 0px;")}
`;

export const STitle = styled.div`
  font-size: var(--title1);
  font-weight: bold;
  display: flex;
`;
export const STop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SSubtitle = styled.div`
  color: var(--secondaryTextColor);
`;

export const SInput = styled.input`
  -moz-box-sizing: border-box; 
  width: 500px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 30px;
  background-color: var(--cardColor);
  border-radius: 6px;
  border: 0px solid #eee;
  outline: none;
  font-size: var(--body1);
  color: var(--textColor);

  ::placeholder {
    color: var(--secondaryTextColor);
  }
`;

export const SInputContainer = styled.div`
  path,
  circle {
    fill: var(--secondaryTextColor);
  }
  svg {
    margin-top: 5px;
    padding-left: 5px;
    vertical-align: baseline;
    position: absolute;
  }
`;

export const SBackButton = styled(motion.div)`
  padding-right: 8px;
  cursor: pointer;
  display: flex;
`;

export const SFilterButton = styled(motion.div)`
  cursor: pointer;
  padding-left: 8px;
  display: flex;
  :hover {
    transform: scale(1.2);
  }
`

export const SAddFilterButton = styled(motion.div)`
  cursor: pointer;
  display: flex;
  :hover {
    transform: scale(1.2);
  }
`

export const SSearchContainer = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
  margin-top: 32px;
  display: inline-flex;
  flex-direction: row;
  justify-content: left;
`
