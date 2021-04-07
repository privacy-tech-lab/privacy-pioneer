import React from "react"
import styled from "styled-components"
import ListCard from "../components/ListCard"
import Scaffold from "../components/Scaffold"
import SummaryCard from "../components/SummaryCard"

const Overview = styled.section`
  .title {
    font-size: var(--title1);
    font-weight: bold;
  }
  .subtitle {
    color: var(--secondaryTextColor);
  }
  .card-group {
    display: flex;
    flex-direction: row;
  }
`

const Recent = styled.section`
  margin-top: 32px;
  .title {
    font-size: var(--title1);
    font-weight: bold;
  }
  .subtitle {
    color: var(--secondaryTextColor);
  }
  .card-group {
    display: flex;
    flex-direction: row;
  }
`

export default () => {
  return (
    <Scaffold>
      <Overview>
        <div className="title">Overview</div>
        <div className="subtitle">A summary of your privacy labels</div>
        <div className="card-group">
          <SummaryCard color="orange" />
          <SummaryCard color="purple" />
          <div className="card purple-gradient"></div>
        </div>
      </Overview>
      <Recent>
        <div className="title">Recent</div>
        <div className="subtitle">See companies who recently collected or shared personal information</div>
        <ListCard/>
      </Recent>
    </Scaffold>
  )
}
