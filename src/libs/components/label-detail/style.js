/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import styled from "styled-components";

export const SBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const SHeaderBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
`;

export const SContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SSpacer = styled.div`
  width: 16px;
`;

export const STitle = styled.div`
  font-weight: bold;
`;

export const STitleDos = styled.div`
  display: flex;
  font-weight: bold;
  justify-content: center; 
`;

export const SDescription = styled.div`
  margin-top: 8px;
  color: var(--secondaryTextColor);
  font-size: var(--body1);
`;

export const SThirdParty = styled.div`
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
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

export const SItem = styled.div`
  display: flex;
  flex-direction: column;
`;
