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

export const SThemeSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const SThemeIcon = styled(motion.div)`
  display: flex;
  padding: 8px;
  margin: 8px;
  cursor: pointer;
  outline: ${(props) =>
    props.theme == props.selTheme
      ? "5px solid var(--primaryBrandColor)"
      : null};
  border-radius: 50%;
`;

export const SExportSection = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 12px;
`;
export const SExportButton = styled.div`
  display: flex;
  background-color: #cbcbcb;
  min-width: 100px;
  padding: 8px 0px;
  justify-content: center;
  color: black;
  margin: 12px 4px;
  border-radius: 8px;
`;

export const SDangerSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  border: 5px solid crimson;
  padding: 8px;
  border-radius: 4px;
  align-self: flex-start;
`;

export const SDangerButton = styled.div`
  display: flex;
  min-width: 100px;
  padding: 8px 4px;
  justify-content: center;
  margin: 12px 4px;
  border: 5px solid crimson;
  border-radius: 8px;
  cursor: pointer;
  :hover {
    background-color: crimson;
  }
`;
