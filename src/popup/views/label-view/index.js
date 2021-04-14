import React from "react"
import Scaffold from "../../components/scaffold"
import * as Icons from "../../../libs/icons"
import { useHistory, useParams } from "react-router-dom"
import { SLeading } from "./style"
import LabelDetail from "../../../libs/label-detail"
import NavBar from "../../components/nav-bar"

const LabelView = () => {
  const history = useHistory()
  const params = useParams()
  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading onClick={() => history.goBack()}>
              <Icons.Back size="24px" />
            </SLeading>
          }
          middle={"Location"}
        />
      }
      body={<LabelDetail />}
    />
  )
}

export default LabelView
