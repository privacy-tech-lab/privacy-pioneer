import React from "react"
import * as Icons from "../../../../../libs/icons"
import { SContainer, SFooter, SHeader, SLabel, STotal } from "./style"

const LabelSummaryCard = ({ color }) => {
  return (
    <SContainer color={color}>
      <SHeader>
        <STotal>29</STotal>
        <SLabel>
          <Icons.Location size="24px" />
          Location
        </SLabel>
      </SHeader>
      <SFooter>Companies collected your location data</SFooter>
    </SContainer>
  )
}

export default LabelSummaryCard
