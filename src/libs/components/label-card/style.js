/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import styled from "styled-components";

export const SCard = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-content: space-between;
  background-color: var(--cardColor);
  width: ${(props) => (props.popup ? "340px" : "250px")};
  margin: ${(props) => props.margin};
  border-radius: 16px;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
`;
export const SContent = styled.div`
  margin: 16px;
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
export const SLogo = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 8px;
  font-size: var(--headline);
  align-items: center;
`;

export const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SHeaderLeading = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const SHeaderTitle = styled.span`
  margin-left: 8px;
  font-weight: bold;
`;

export const SHeaderTrailing = styled.div`
  height: 24px;
  width: 24px;
`;

export const SDescription = styled.div`
  color: var(--secondaryTextColor);
  font-size: var(--body2);
  margin-top: 8px;
`;

export const SBadge = styled.div`
  border: solid var(--primaryHighlightColor) 3px;
  color: var(--primaryHighlightColor);
  border-radius: 1em;
  text-align: center;
  justify-self: center;
  align-self: center;
  padding: 4px 8px;
  margin: 2px 4px;
  width: fit-content;
  font-weight: 600;
`;

export const SMore = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  padding: 2px;
  font-weight: 600;
  padding-left: 2px;

  /* background-color: var(--primaryHighlightColor); */
  color: var(--primaryTextColorr);
  font-size: var(--headline);
  path,
  circle {
    fill: var(--primaryTextColor);
  }
`;
