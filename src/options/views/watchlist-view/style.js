/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import styled from "styled-components";

export const SContainer = styled.section`
  ${(props) => (props.marginTop ? "margin-top: 32px;" : "margin-top: 0px;")}
`;

export const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  > * {
    :first-child {
      width: 50%;
    }
  }
`;

export const STitle = styled.div`
  font-size: var(--title1);
  font-weight: bold;
`;

export const SSubtitle = styled.div`
  color: var(--secondaryTextColor);
`;

export const SAddButton = styled.div`
  cursor: pointer;
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  color: var(--primaryBrandColor);
  background-color: var(--primaryBrandTintColor);
  padding: 8px 16px 8px 16px;
  font-weight: bold;
  margin: 0px 8px;
  path,
  circle {
    fill: var(--primaryBrandColor);
  }
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
  > * {
    :first-child {
      padding-right: 4px;
      margin-left: -4px;
    }
  }
`;

export const SListHeader = styled.div`
  margin-top: 32px;
  padding-bottom: 16px;
  display: flex;
  flex-direction: row;
  color: var(--secondaryTextColor);
  font-size: var(--body2);
  border-bottom: 1px solid var(--seperatorColor);
  > * {
    :first-child {
      width: 50%;
    }
  }
  > * {
    :last-child {
    }
  }
`;

export const SListContent = styled.div`
  display: flex;
  flex-direction: column;
`;
