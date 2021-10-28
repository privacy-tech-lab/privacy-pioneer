/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

//styling for Search View

import { motion } from "framer-motion"
import styled from "styled-components"

export const SContainer = styled.section`
  ${(props) => (props.marginTop ? "margin-top: 32px;" : "margin-top: 0px;")}
`

export const STitle = styled.div`
  font-size: var(--title1);
  font-weight: bold;
  display: flex;
`
export const STop = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
export const SFiltersDiv = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
`
export const SSubtitle = styled.div`
  color: var(--secondaryTextColor);
  margin-bottom: 32px;
`

export const SBackButton = styled(motion.div)`
  padding-right: 8px;
  cursor: pointer;
  display: flex;
`

export const SEmpty = styled.div`
  font-size: var(--title2);
  font-weight: bold;
  display: ${(props) => (props.show ? "block" : "none")};
`
