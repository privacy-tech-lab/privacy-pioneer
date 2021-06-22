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
export const SBody = styled.div`
  margin-top: 12px;
  font-size: var(--headline);
`;

export const SAnswer = styled.div`
  margin-top: 8px;
  text-align: justify;
  font-size: var(--body1);
  margin-right: 48px;
`;

export const SQuestion = styled.div`
  margin-top: 16px;
  color: var(--secondaryTextColor);
  font-size: var(--title2);
  font-weight: bold;
`;
