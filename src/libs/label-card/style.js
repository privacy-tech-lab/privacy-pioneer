import styled from "styled-components";

export const SCard = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--cardColor);
  max-width: ${(props) => (props.popup ? "340px" : "250px")};
  margin: ${(props) => props.margin};
  padding: 16px;
  border-radius: 16px;
  :hover {
    filter: brightness(0.95);
  }
  :active {
    filter: brightness(1.05);
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
export const SLogo = styled.div`
  display: flex;
  flex-direction: row;
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

export const SMore = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;
