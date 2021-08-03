/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import styled from "styled-components";

export const SContainer = styled.div`
  margin-top: 16px;
  min-height: 128px;
  display: flex;
  flex-direction: column;
`;

export const SItem = styled.div`
  margin-left: -16px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  background-color: var(--backgroundColor);
`;

export const SLabelGroup = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
`;

export const SLabel = styled.div`
  display: flex;
  background-color: var(--cardColor);
  padding: 8px 16px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  svg:first-of-type {
    margin-right: 4px;
  }
`;

export const SSeperator = styled.div`
  display: flex;
  height: 1px;
  margin-left: ${(prop) => prop.marginLeft};
  margin-right: ${(prop) => prop.marginRight};
  background-color: var(--seperatorColor);
  margin-top: ${(prop) => prop.marginTop};
  margin-bottom: ${(prop) => prop.marginBottom};
`;
