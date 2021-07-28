import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import * as Icons from "../../../libs/icons"
import { useHistory, useParams } from "react-router-dom"
import { SLeading } from "./style"
import LabelDetail from "../../../libs/label-detail"
import NavBar from "../../components/nav-bar"
import { privacyLabels } from "../../../background/analysis/classModels"
import { getWebsiteLabels } from "../../../libs/indexed-db/getIdbData.js"

/**
 * Page view detailing information collected and shared.
 * Destination after clicking a 'label card'
 */
const LabelView = () => {
  const [requests, setRequests] = useState({})

  const history = useHistory()
  const params = useParams()
  const website = params.website // Get website passed from route
  const label = params.label // Get label passed from route

  useEffect(() => getWebsiteLabels(website).then((labels) => setRequests(labels?.[label] ?? {})), [])

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
      body={
        Object.keys(requests).length ? <LabelDetail website={website} label={label} requests={requests} /> : null
      }
    />
  )
}

export default LabelView
