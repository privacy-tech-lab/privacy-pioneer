import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import * as Icons from "../../../libs/icons"
import { useHistory, useParams } from "react-router-dom"
import { SLeading } from "./style"
import LabelDetail from "../../../libs/label-detail"
import NavBar from "../../components/nav-bar"
import { privacyLabels } from "../../../libs/constants"
import { getDomainLabels } from "../../../libs/indexed-db"

const LabelView = () => {
  const [details, setDetails] = useState({})

  const history = useHistory()
  const params = useParams()
  const website = params.website
  const label = params.label

  useEffect(() => {
    getDomainLabels(website).then((labels) => {
      setDetails(labels?.[label] ?? {})
    })
  }, [])

  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading onClick={() => history.replace({ pathname: `/` })}>
              <Icons.Back size="24px" />
            </SLeading>
          }
          middle={privacyLabels[label]["displayName"]}
        />
      }
      body={Object.keys(details).length !== 0 ? <LabelDetail domain={website} label={label} details={details} /> : null}
    />
  )
}

export default LabelView
