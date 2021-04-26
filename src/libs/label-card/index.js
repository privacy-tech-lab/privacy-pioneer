import React from "react"
import WebsiteBadge from "../website-badge"
import * as Icons from "../icons"
import { useHistory } from "react-router-dom"
import { SCard, SDescription, SSeperator, SHeader, SHeaderLeading, SHeaderTitle, SHeaderTrailing, SMore } from "./style"
import { privacyLabels } from "../constants"

const More = ({ count }) => (
  <SMore>
    <Icons.PlusCircle size="24px" />
    <span style={{ marginLeft: "8px" }}>
      {count} {count > 1 ? "others" : "other"}
    </span>
  </SMore>
)

const LabelCard = (props) => {
  const history = useHistory()
  const website = props.domain
  const label = props.label
  const keys = Object.keys(props.data)

  const getDescription = () => {
    let firstParty = keys.includes(website)
    if (firstParty && keys.length > 1) {
      return `${website} collected and shared ${label} data with the following companies:`
    } else if (firstParty) {
      return `${website} collected ${label} data.`
    } else {
      return `${website} shared ${label} data with the following companies:`
    }
  }

  const getThirdParties = () => {
    let firstParty = keys.includes(website)
    if ((firstParty && keys.length > 1) || !firstParty) {
      const _keys = keys.filter((item) => item !== website)
      if (_keys.length > 2) {
        return (
          <>
            <SSeperator marginTop="16px" marginBottom="0px" />
            {_keys.slice(0, 2).map((key) => (
              <WebsiteBadge key={key} domain={key} />
            ))}
            <More count={_keys.length - 2} />
          </>
        )
      } else {
        return (
          <>
            <SSeperator marginTop="16px" marginBottom="0px" />
            {_keys.map((key) => (
              <WebsiteBadge key={key} domain={key} />
            ))}
          </>
        )
      }
    } else {
      return null
    }
  }

  return (
    <SCard
      margin={props.margin}
      onClick={() =>
        props.onTap != null ? props.onTap() : history.push({ pathname: `/website/${website}/label/${label}` })
      }
    >
      <SHeader>
        <SHeaderLeading>
          {Icons.getLabelIcon(label)}
          <SHeaderTitle>{privacyLabels[label]["displayName"]}</SHeaderTitle>
        </SHeaderLeading>
        <SHeaderTrailing>
          <Icons.ChevronRight size="24px" />
        </SHeaderTrailing>
      </SHeader>
      <SDescription>{getDescription()}</SDescription>
      {getThirdParties()}
    </SCard>
  )
}

export default LabelCard
