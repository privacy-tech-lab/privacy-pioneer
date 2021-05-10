import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import WebsiteLogo from "../../../libs/website-logo"
import LabelCard from "../../../libs/label-card"
import { SDescription, SHeader, SIcon, SLabelGroup, SText, STitle } from "./style"
import { useParams } from "react-router-dom"
import LabelModal from "./components/label-modal"
import { getWebsiteLabels } from "../../../libs/indexed-db"
import { Modal } from "bootstrap"

/**
 * Website page view containing overview of identified label cards
 */
const WebsiteView = () => {
  const params = useParams()
  const website = params.website
  const [modal, setModal] = useState({ show: false })
  const [labels, setLabels] = useState({})

  useEffect(() => {
    getWebsiteLabels(website).then((labels) => setLabels(labels))
    // Add listener to modal so we can reset it by taking it off the dom so it doesn't hold references
    document.getElementById("detail-modal").addEventListener("hidden.bs.modal", () => {
      setModal({ show: false })
    })
  }, [])
  return (
    <React.Fragment>
      <LabelModal label={modal.label} requests={modal.requests} website={modal.website} show={modal.show} />
      <Scaffold>
        <SHeader>
          <SIcon>
            <WebsiteLogo large website={website} />
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
              onTap={() => {
                const modal = new Modal(document.getElementById("detail-modal"))
                setModal({ label, requests, website, show: true })
                modal.show()
              }}
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
