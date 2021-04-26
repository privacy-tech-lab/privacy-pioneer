import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import WebsiteLogo from "../../../libs/website-logo"
import LabelCard from "../../../libs/label-card"
import { SDescription, SHeader, SIcon, SLabelGroup, SText, STitle } from "./style"
import { useParams } from "react-router-dom"
import LabelModal from "./components/label-modal"
import { getDomainLabels } from "../../../libs/indexed-db"

const WebsiteView = () => {
  const params = useParams()
  const domain = params.website
  const [showModal, setShowModal] = useState({ show: false })
  const [labels, setLabels] = useState({})

  const openModal = ({ label, details, domain }) =>
    setShowModal((obj) => {
      return { ...obj, label, details, domain, show: !obj.show }
    })

  useEffect(() => {
    getDomainLabels(domain).then((labels) => setLabels(labels))
  }, [])

  return (
    <React.Fragment>
      <LabelModal
        showModal={showModal.show}
        setShowModal={setShowModal}
        label={showModal.label}
        details={showModal.details}
        domain={showModal.domain}
      />
      <Scaffold>
        <SHeader>
          <SIcon>
            <WebsiteLogo large domain={domain} />
          </SIcon>
          <SText>
            <STitle>{domain}</STitle>
            <SDescription>The following pravicy practices were identified from www.amazon.com</SDescription>
          </SText>
        </SHeader>
        <SLabelGroup>
          {Object.entries(labels).map(([key, value]) => (
            <LabelCard
              key={key}
              onTap={() => openModal({ details: value, label: key, domain: domain })}
              margin="16px 16px 0px 0px"
              label={key}
              data={value}
              domain={domain}
            />
          ))}
        </SLabelGroup>
      </Scaffold>
    </React.Fragment>
  )
}

export default WebsiteView
