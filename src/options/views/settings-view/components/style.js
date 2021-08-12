/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import styled from "styled-components"
import { motion } from "framer-motion"

export const SContainer = styled.section`
  ${(props) => (props.marginTop ? "margin-top: 32px;" : "margin-top: 0px;")}
`

export const STitle = styled.div`
  font-size: var(--title1);
  font-weight: bold;
`

export const SSubtitle = styled.div`
  color: var(--secondaryTextColor);
`

export const SSwitch = styled.div`
  display: flex;
  cursor: pointer;
  align-self: center;
  width: 60px;
  height: 30px;
  border-radius: 16px;
  background-color: ${(prop) => (prop.active ? "#6b219f" : "#949494")};
`

export const SKnob = styled(motion.div)`
  height: 80%;
  aspect-ratio: 1/1;
  background-color: white;
  border-radius: 50%;
  align-self: center;
  margin: 0px 4px;
`

export const SSwitchLabel = styled.div`
  font-size: var(--title2);
  font-weight: 400;
  align-self: center;
  margin-right: 24px;
`

export const SSettingHeader = styled.div`
  font-size: var(--title2);
  font-weight: bold;
  margin-top: 8px;
`

export const SLabelToggle = styled.div`
  margin-left: 8px;
  flex-direction: column;
`

export const SSnippetToggle = styled.div`
  margin-left: 8px;
  flex-direction: column;
`

export const SThemeSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const SThemeIcon = styled(motion.div)`
  display: flex;
  padding: 8px;
  margin: 8px;
  cursor: pointer;
  outline: ${(props) =>
    props.theme == props.selTheme ? "5px solid #6b219f" : null};
  border-radius: 50%;
`

export const SExportSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 8px;
  margin-top: 8px;
`
export const SExportButton = styled.div`
  display: flex;
  color: var(--primaryBrandColor);
  background-color: var(--primaryBrandTintColor);
  cursor: pointer;
  min-width: 100px;
  padding: 8px 0px;
  justify-content: center;
  font-weight: bold;
  margin-top: 12px;
  margin-right: 12px;
  border-radius: 8px;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
`

export const SDropdownOptions = styled.div`
  top: 56px;
  margin-left: auto;
  margin-right: 12px;
  left: 0;
  right: 0;
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  background-color: var(--textFieldColor);
  box-shadow: 0px 4px 16px -8px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  z-index: 3;
  > * {
    :first-child {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
  > * {
    :last-child {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
`

export const SDropdownItem = styled.div`
  border: 1px solid var(--seperatorColor);
  padding: 8px;
  cursor: pointer;
  background-color: var(--textFieldColor);
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
  @media (prefers-color-scheme: dark) {
    :hover {
      filter: brightness(0.85);
    }
    :active {
      filter: brightness(1.15);
    }
  }
`

export const SDropdown = styled.div`
  position: relative;
  display: flex;
`

export const SDropdownSelection = styled.div`
  cursor: pointer;
  align-items: center;
  padding: 0px 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--textFieldColor);
  margin-top: 12px;
  margin-right: 12px;
  width: 125px;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
  @media (prefers-color-scheme: dark) {
    :hover {
      filter: brightness(0.85);
    }
    :active {
      filter: brightness(1.15);
    }
  }
`

export const SDangerSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 10px;
  border: 5px solid crimson;
  padding: 8px;
  border-radius: 4px;
  align-self: flex-start;
`

export const SDangerButton = styled.div`
  display: flex;
  min-width: 100px;
  padding: 8px 4px;
  justify-content: center;
  margin: 12px 8px;
  border: 5px solid crimson;
  border-radius: 8px;
  cursor: pointer;
  :hover {
    background-color: crimson;
    color: white;
  }
`
