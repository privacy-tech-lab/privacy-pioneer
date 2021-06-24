import React from "react"
import * as Icons from "../../../../../libs/icons"
import { SContainer, SFooter, SHeader, SLabel, STotal } from "./style"

/**
 * Summary card that highlights notable stat from identified label
 */
const LabelSummaryCard = ({labeltype, website }) => {
  return (
    <SContainer labeltype={labeltype}>
      <SHeader>
        <STotal>{website}</STotal>
        <SLabel>
          {Icons.getLabelIcon(labeltype)}
          {labeltype.charAt(0).toUpperCase() + labeltype.slice(1)}
        </SLabel>
      </SHeader>
      <SFooter>Companies collected {labeltype} data.</SFooter>
    </SContainer>
  )
}

/**
 * List of Summary cards given label and stat {label:stat}
 */

const LabelSummaryCardList = ({ labels }) => {
  const entries = Object.entries(labels)
  return (
    entries.map(([labeltype, numOfWebsites]) =>
      <LabelSummaryCard key={labeltype} labeltype={labeltype} website={numOfWebsites} />))
      }

      export default LabelSummaryCardList
