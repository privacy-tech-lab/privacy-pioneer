/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react"
import { privacyLabels } from "../../../../../background/analysis/classModels"
import * as Icons from "../../../../../libs/icons"
import { SContainer, SFooter, SHeader, SLabel, STotal } from "./style"
import { useHistory } from "react-router"
import ReactTooltip from "react-tooltip"

/**
 * Summary card that highlights notable stats from identified label
 * namely it states how many websites you have visited have used that label
 */
const LabelSummaryCard = ({
  labeltype,
  websiteTotal,
  passWebsites,
  passLabels,
}) => {
  const history = useHistory()
  return (
    <SContainer
      labeltype={labeltype}
      data-place="bottom"
      data-tip={privacyLabels[labeltype]["description"]}
      onClick={() => {
        history.push({
          pathname: "/search",
          state: {
            labeltype: labeltype,
            websites: passWebsites,
            labels: passLabels,
          },
        })
        ReactTooltip.hide()
      }}
    >
      <SHeader>
        <STotal>{websiteTotal}</STotal>
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
 * @param {object} labels label and stat {label:stat} object
 */
const LabelSummaryCardList = ({ labels, passWebsites }) => {
  const entries = Object.entries(labels)
  return entries.map(([labeltype, evidence]) => {
    let numOfWebsites = 0
    Object.values(evidence).forEach(
      (website) => (numOfWebsites += Object.keys(website).length)
    )
    return (
      <LabelSummaryCard
        key={labeltype}
        labeltype={labeltype}
        websiteTotal={numOfWebsites}
        passWebsites={passWebsites}
        passLabels={labels}
      />
    )
  })
}

export default LabelSummaryCardList
