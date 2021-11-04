/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import styled from "styled-components"

export const SBadge = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border: solid;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0);
  color: var(--primaryHighlightColor);
  border-color: var(--primaryHighlightColor);
  border-width: 2px;
  font-size: 12px;
  margin-right: 8px;
  margin-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  font-weight: bold;
`

export const SBadgeGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .active {
    background-color: var(--primaryBrandTintColor);
    color: var(--primaryBrandColor);
    border-color: var(--primaryBrandTintColor);
  }
`
