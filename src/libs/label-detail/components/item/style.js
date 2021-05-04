import { motion } from "framer-motion"
import styled from "styled-components"

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

export const SBadgeGroup = styled.div`
  display: flex;
  flex-direction: row;
`