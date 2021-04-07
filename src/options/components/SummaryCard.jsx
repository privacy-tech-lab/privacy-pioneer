import React from "react"
import styled from "styled-components"
import { LocationIcon } from "../../components/Icons"

const Wrapper = styled.div`
  margin-right: 32px;
  margin-top: 16px;
  width: 250px;
  height: 125px;
  box-shadow: 0px 0px 32px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background: ${(props) => getColor(props.color)};
  display: flex;
  flex-direction: column;
  padding: 16px 16px 16px;
  color: white;
  path, circle {
    fill: white;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
  }

  .total {
    font-size: 64px;
    line-height: 32pt;
    font-weight: bold;
  }

  .label {
    display: flex;
    flex-direction: row;
    align-items: center;
    .icon {
      margin-right: 4px;
    }
    .text {
    }
  }

  .footer{
    display: flex;
    margin-top: auto;
  }
`

const getColor = (color) => {
  switch (color) {
    case "orange":
      return "linear-gradient(180deg, #efa493 0%, #e77f7e 100%)"
    case "purple":
      return "linear-gradient(180deg, #B7AFF2 0%, #5C7ADD 100%)"
    default:
      break
  }
}

const SummaryCard = ({ color }) => {
  return (
    <Wrapper color={color}>
      <div className="header">
        <div className="total">29</div>
        <div className="label">
          <div className="icon">
            <LocationIcon size="24px" />
          </div>
          <div className="text">Location</div>
        </div>
      </div>
      <div className="footer">
        Companies collected your location data
      </div>
    </Wrapper>
  )
}

export default SummaryCard
