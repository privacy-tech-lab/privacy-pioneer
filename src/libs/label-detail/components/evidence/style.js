import { motion } from "framer-motion"
import styled from "styled-components"

export const SContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0);
  margin: 0px;
  padding: 0px;
  border: 0;
`

export const SHeader = styled.div`
  margin-bottom: ${(props) => props.marginBottom};
  margin-top: ${(props) => props.marginTop};
  font-size: 14px;
  font-weight: bold;
  color: var(--textColor);
`

export const SCodeBlock = styled(motion.div)`
  pre {
    margin: 0px;
    font-size: 12px;
    line-height: 150%;
    font-family: monospace;
    white-space: pre;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -o-pre-wrap;
    width: 100%;
    display: block;
    padding: 8px;
    background: var(--textFieldColor);
    border-radius: 8px;
  }
  span {
    font-weight: bold;
    color: #f44336;
  }
`

export const SBody = styled.div`
  overflow-x: scroll;
  pre {
    margin: 0px;
    font-size: 12px;
    line-height: 150%;
    font-family: monospace;
    width: 100%;
    display: block;
    padding: 8px;
    background: var(--textFieldColor);
    border-radius: 8px;
  }
  code {
    white-space: nowrap !important;
  }
`

export const SBodyMod = styled.div`
overflow: scroll;
max-height: 100px;
pre {
  margin: 0px;
  font-size: 12px;
  line-height: 150%;
  font-family: monospace;
  white-space: pre;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  width: 100%;
  display: block;
  padding: 8px;
  background: var(--textFieldColor);
  border-radius: 8px;
}
`

export const SEvidenceDescription = styled.div`
  pre {
    margin: 0px;
    font-size: 12px;
    line-height: 150%;
    font-family: monospace;
    white-space: pre;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -o-pre-wrap;
    width: 100%;
    display: block;
    padding: 8px;
    background: var(--textFieldColor);
    border-radius: 8px;
  }
  span {
    font-weight: bold;
    color: var(--secondaryTextColor);
  }
`

export const SCollapse = styled.div``
