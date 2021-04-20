import { motion } from "framer-motion"
import styled from "styled-components"

export const SContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  pre {
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
    color: #f44336;
  }
`

export const SHeader = styled.div`
  margin-top: 16px;
  font-size: 14px;
`
