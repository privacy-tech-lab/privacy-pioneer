import styled from "styled-components";

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

export const SCardGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SSectionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SButtonText = styled.div`
  font-weight: bold;
  cursor: pointer;
  color: var(--primaryHighlightColor);
  text-decoration: underline;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
`;
