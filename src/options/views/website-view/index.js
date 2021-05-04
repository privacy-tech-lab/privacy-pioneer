import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import WebsiteLogo from "../../../libs/website-logo"
import LabelCard from "../../../libs/label-card"
import { SDescription, SHeader, SIcon, SLabelGroup, SText, STitle } from "./style"
import { useParams } from "react-router-dom"
import LabelModal from "./components/label-modal"
import { getWebsiteLabels } from "../../../libs/indexed-db"

const WebsiteView = () => {
  const params = useParams()
  const website = params.website
  const [modal, setModal] = useState({ show: false })
  const [labels, setLabels] = useState({})

  useEffect(() => getWebsiteLabels(website).then((labels) => setLabels(labels)), [])

  return (
    <React.Fragment>
      <LabelModal
        show={modal.show}
        setModal={setModal}
        label={modal.label}
        requests={modal.requests}
        website={modal.website}
      />
      <Scaffold>
        <SHeader>
          <SIcon>
            <WebsiteLogo large domain={website} />
          </SIcon>
          <SText>
            <STitle>{website}</STitle>
            <SDescription>The following pravicy practices were identified from {website}</SDescription>
          </SText>
        </SHeader>
        <SLabelGroup>
          {Object.entries(labels).map(([label, requests]) => (
            <LabelCard
              key={label}
              onTap={() => setModal((obj) => ({ ...obj, label, requests, website, show: !obj.show }))}
              margin="16px 16px 0px 0px"
              label={label}
              requests={requests}
              website={website}
            />
          ))}
        </SLabelGroup>
      </Scaffold>
    </React.Fragment>
  )
}

export default WebsiteView
