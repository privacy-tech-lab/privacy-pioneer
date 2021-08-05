import ReactHintFactory from "react-hint"
import "react-hint/css/index.css"
import React from "react"
import styled from "styled-components"
import { Tooltip } from "bootstrap"

const SHint = styled.div`
  padding: 8px;
  border-radius: 5px;
  background: var(--primaryBrandColor);
  font-size: var(--body1);
  text-align: center;
  width: max-content;
  color: white;
  max-width: ${(props) =>
    props.multiline ? (props.popup ? "150px" : "350px") : "none"};
`

export const initTooltips = () => {
  [].slice
      .call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
      .map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl))
}

const Tooltips = ({ popup }) => {
  const ReactHint = ReactHintFactory(React)
  return (
    <ReactHint
      attribute="data-custom"
      position="bottom"
      events={{ hover: true }}
      delay={{ show: 300 }}
      onRenderContent={(target, content) => {
        return (
          <SHint popup={popup} multiline={target.dataset.customMultiline}>
            {target.dataset.customInfo}
          </SHint>
        )
      }}
    />
  )
}
export default Tooltips
