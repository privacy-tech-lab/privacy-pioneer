import styled from "styled-components";

export const SContainer = styled.section`
  ${(props) => (props.marginTop ? "margin-top: 32px;" : "margin-top: 0px;")}
`;

export const STitle = styled.div`
  font-size: var(--title1);
  margin-bottom: 8px;
  font-weight: bold;
`;

export const SSubtitle = styled.div`
  color: var(--secondaryTextColor);
`;
export const SBody = styled.div`
  margin-top: 12px;
  font-size: var(--headline);
`;

export const SAnswer = styled.div`
  margin-top: 8px;
  text-align: justify;
  font-size: 16px;
  margin-right: 48px;
`;

export const SQuestion = styled.div`
  color: var(--secondaryTextColor);
  font-size: var(--title2);
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`;

export const SQuestionCard = styled.div`
  background-color: var(--cardColor);
  justify-self: stretch;
  margin-left: 16px;
  margin-right: 16px;
  cursor: pointer;
  padding: 8px 0px 8px 8px;
  margin-bottom: 12px;
  border-radius: 8px;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
  }
`;

export const SArrow = styled.div`
  margin-right: 8px;
`;
