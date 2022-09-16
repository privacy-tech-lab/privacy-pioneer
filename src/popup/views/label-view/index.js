/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import * as Icons from "../../../libs/icons"
import { useHistory, useParams } from "react-router-dom"
import { SLeading } from "./style"
import LabelDetail from "../../../libs/components/label-detail"
import NavBar from "../../components/nav-bar"
import { permissionEnum, privacyLabels } from "../../../background/analysis/classModels"
import { getWebsiteLabels } from "../../../libs/indexed-db/getIdbData.js"
import { handleClick } from "../../../libs/indexed-db/getAnalytics"

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

  useEffect(() => getWebsiteLabels(website).then((labels) => {
    var result = {};
    for (const [labelL, value] of Object.entries(labels)) {
      if (labelL != permissionEnum.location && labelL != permissionEnum.tracking){
        result[labelL] = value
      } else {
        for (const [url, typeVal] of Object.entries(value)) {
          for (const [type, e] of Object.entries(typeVal)) {
            if ( !(typeof e['watchlistHash'] === "string" )) {
              // Add label in data to object
              if (!(labelL in result)) {
                result[labelL] = { [url]: { [type]: e } }
              } else if (!(url in result[labelL])) {
                result[labelL][url] = { [type]: e }
              } else {
                result[labelL][url][type] = e
              }
            }
          }
        }
      }
    }
    const a = result?.[label]??{}
    setRequests(a)
  }), [])

  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading onClick={() => { 
              history.replace({ pathname: `/` })
              handleClick("Go Back from Label Card (Website)", "Website", null, null, null)
            }}>
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
