import { motion } from "framer-motion"
import styled from "styled-components"

export const SBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const SHeader = styled.div`
  display: flex;
  flex-direction: row;
  margin: 16px;
`

export const SContent = styled.div`
  display: flex;
  flex-direction: column;
`

export const SSpacer = styled.div`
  width: 16px;
`

export const STitle = styled.div`
  font-weight: bold;
`

export const SDescription = styled.div`
  margin-top: 8px;
  color: var(--secondaryTextColor);
  font-size: var(--body2);
`

export const SBadgeGroup = styled.div`
  display: flex;
  flex-direction: row;
`

export const SThirdParty = styled.div`
  margin-top: 16px;
  margin-left: 16px;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
`

export const SItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
`

export const SSeperator = styled.div`
  display: flex;
  height: 1px;
  margin-left: ${(prop) => prop.marginLeft};
  margin-right: ${(prop) => prop.marginRight};
  background-color: var(--seperatorColor);
  margin-top: ${(prop) => prop.marginTop};
  margin-bottom: ${(prop) => prop.marginBottom};
`

export const SBadge = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background: #f2e8f9;
  border-radius: 16px;
  color: #6b219f;
  font-size: 12px;
  margin-right: 8px;
  margin-top: 8px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  ${props => props.selected ? 'font-weight: bold;' : null}
`
