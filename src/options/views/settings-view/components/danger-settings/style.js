/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import styled from "styled-components";

//styling for Danger section component

export const SSubtitle = styled.div`
  color: var(--secondaryTextColor);
`;

export const SSettingHeader = styled.div`
  font-size: var(--title2);
  font-weight: bold;
  margin-top: 8px;
`;

export const SDangerSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 10px;
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
  margin: 12px 8px;
  border: 5px solid crimson;
  border-radius: 8px;
  cursor: pointer;
  :hover {
    background-color: crimson;
    color: white;
  }
`;
