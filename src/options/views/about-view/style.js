/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

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
  margin-top: 8px;
  margin-bottom: 12px;
  font-size: var(--headline);
  a {
  color: var(--primaryBrandColor);
  }
`;

export const SAnswer = styled.div`
  margin-top: 12px;
  text-align: left;
  font-size: 18px;
  margin-right: 8px;
  cursor: text;
`;

export const SQuestion = styled.div`
  color: var(--primaryTextColor);
  font-size: var(--title2);
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;

export const SQuestionCard = styled.div`
  background-color: var(--cardColor);
  justify-self: stretch;
  margin-left: 16px;
  margin-right: 16px;
  cursor: pointer;
  padding: 12px 0px 12px 8px;
  margin-bottom: 12px;
  border-radius: 8px;
`;

export const SArrow = styled.div`
  margin-right: 8px;
`;
