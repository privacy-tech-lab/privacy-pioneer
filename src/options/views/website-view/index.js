import React, { useState } from "react"
import Scaffold from "../../components/scaffold"
import WebsiteLogo from "../../../libs/website-logo"
import LabelCard from "../../../libs/label-card"
import { SDescription, SHeader, SIcon, SLabelGroup, SText, STitle } from "./style"
import { useParams } from "react-router-dom"
import LabelModal from "./components/label-modal"

const WebsiteView = () => {
  const params = useParams()
  const [showModal, setShowModal] = useState(false)

  const openModal = () => setShowModal((state) => !state)

  return (
    <React.Fragment>
      <LabelModal showModal={showModal} setShowModal={setShowModal} />
      <Scaffold>
        <SHeader>
          <SIcon>
            <WebsiteLogo large domain={"Amazon"} />
          </SIcon>
          <SText>
            <STitle>Amazon</STitle>
            <SDescription>The following pravicy practices were identified from www.amazon.com</SDescription>
          </SText>
        </SHeader>
        <SLabelGroup>
          <LabelCard onTap={openModal} margin="16px 16px 0px 0px" label="location" />
          <LabelCard onTap={openModal} margin="16px 16px 0px 0px" label="location" />
        </SLabelGroup>
      </Scaffold>
    </React.Fragment>
  )
}

export default WebsiteView
