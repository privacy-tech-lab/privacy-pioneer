import React from "react"
import { privacyLabels } from "../../../../../background/analysis/classModels"
import * as Icons from "../../../../../libs/icons"
import { SContainer, SFooter, SHeader, SLabel, STotal } from "./style"
import ReactTooltip from "react-tooltip"

/**
 * Summary card that highlights notable stat from identified label
 */
const LabelSummaryCard = ({ labeltype, website }) => {
  return (
    <>
      <SContainer
        labeltype={labeltype}
        data-tip={privacyLabels[labeltype]["description"]}
        data-for="labelCard"
      >
        <SHeader>
          <STotal>{website}</STotal>
          <SLabel>
            {Icons.getLabelIcon(labeltype)}
            {labeltype.charAt(0).toUpperCase() + labeltype.slice(1)}
          </SLabel>
        </SHeader>
        <SFooter>Companies collected {labeltype} data.</SFooter>
      </SContainer>
    </>
  )
}

/**
 * List of Summary cards given label and stat {label:stat}
 */

const LabelSummaryCardList = ({ labels }) => {
  const entries = Object.entries(labels)
  return entries.map(([labeltype, numOfWebsites]) => (
    <>
      <ReactTooltip
        place="bottom"
        effect="solid"
        textColor="var(--primaryBrandColor)"
        backgroundColor="var(--primaryBrandTintColor)"
        delayShow="500"
        id="labelCard"
      />
      <LabelSummaryCard
        key={labeltype}
        labeltype={labeltype}
        website={numOfWebsites}
      />
    </>
  ))
}

export default LabelSummaryCardList
