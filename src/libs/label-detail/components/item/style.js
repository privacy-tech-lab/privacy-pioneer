import styled from "styled-components"

export const SBadge = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: solid;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0);
  color: var(--primaryBadgeColor);
  border-color: var(--primaryBadgeColor);
  border-width: 2px;
  font-size: 12px;
  margin-right: 8px;
  margin-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  font-weight: bold;
  @media (prefers-color-scheme: dark) {
    color: var(--primaryBrandTintColor);
    border-color: var(--primaryBrandTintColor);
  }
`

export const SBadgeGroup = styled.div`
  display: flex;
  flex-direction: row;
  .active {
    background-color: var(--primaryBrandTintColor);
    color: var(--primaryBrandColor);
    border-color: var(--primaryBrandTintColor);
  }
`
