import React from "react"
import WebsiteBadge from "../website-badge"
import * as Icons from "../icons"
import { useHistory } from "react-router-dom"
import { SCard, SDescription, SSeperator, SHeader, SHeaderLeading, SHeaderTitle, SHeaderTrailing, SMore } from "./style"

const More = ({ count }) => (
  <SMore>
    <Icons.PlusCircle size="24px" />
    <span style={{ marginLeft: "8px" }}>{count} others</span>
  </SMore>
)

const LabelCard = (props) => {
  const history = useHistory()
  const website = "www.amazon.com"
  const label = "location"
  return (
    <SCard
      margin={props.margin}
      onClick={() =>
        props.onTap != null ? props.onTap() : history.push({ pathname: `/website/${website}/label/${label}` })
      }
    >
      <SHeader>
        <SHeaderLeading>
          <Icons.Location size="24px" />
          <SHeaderTitle>Location</SHeaderTitle>
        </SHeaderLeading>
        <SHeaderTrailing>
          <Icons.ChevronRight size="24px" />
        </SHeaderTrailing>
      </SHeader>
      <SDescription>
        Amazon collected and shared your location data - <strong>Coarse Location</strong> with the following companies.
      </SDescription>
      <SSeperator marginTop="16px" marginBottom="0px" />
      <WebsiteBadge domain="Facebook" />
      <WebsiteBadge domain="Google" />
      <More count={4} />
    </SCard>
  )
}

export default LabelCard
