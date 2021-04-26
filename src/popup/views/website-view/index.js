import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import WebsiteLogo from "../../../libs/website-logo"
import LabelCard from "../../../libs/label-card"
import * as Icons from "../../../libs/icons"
import { SLeading, SBrandIcon, SBrandTitle, STrailing, SBody, SHeader, STitle, SSubtitle, SIconWrapper } from "./style"
import NavBar from "../../components/nav-bar"
import { getDomainLabels } from "../../../libs/indexed-db"
import { getHostname } from "../../../background/analysis/searchFunctions"

const WebsiteView = () => {
  const [domain, setDomain] = useState("...")
  const [labels, setLabels] = useState({})

  const navigate = ({ urlHash = "" }) => {
    const url = browser.runtime.getURL("options.html")
    browser.tabs.query({ url: url }, function (tabs) {
      if (tabs.length) {
        browser.tabs.update(tabs[0].id, { active: true, url: url + urlHash })
      } else {
        browser.tabs.create({ url: url + urlHash })
      }
    })
  }

  const getCount = () => {
    const keys = Object.keys(labels)
    if (keys.length === 0) {
      return "0 Privacy Practices Identified"
    } else if (keys.length === 1) {
      return "1 Privacy Practice Identified"
    } else {
      return `${keys.length} Privacy Practices Identified`
    }
  }

  useEffect(() => {
    const message = (request, sender, sendResponse) => {
      if (request.msg === "popup.currentTab") {
        const host = getHostname(request.data)
        getDomainLabels(host).then((labels) => setLabels(labels))
        setDomain(host)
      }
    }
    browser.runtime.onMessage.addListener(message)
    browser.runtime.sendMessage({ msg: "background.currentTab" })
    return () => browser.runtime.onMessage.removeListener(message)
  }, [])

  return (
    <Scaffold
      navigationBar={
        <NavBar
          leading={
            <SLeading>
              <SBrandIcon /> <SBrandTitle>Integrated Privacy Analysis</SBrandTitle>
            </SLeading>
          }
          trailing={
            <STrailing>
              <SIconWrapper onClick={() => navigate({ urlHash: "#watchlist" })}>
                <Icons.Radar size="24px" />
              </SIconWrapper>
              <SIconWrapper onClick={() => navigate({ urlHash: "#" })}>
                <Icons.MoreVertical size="24px" />
              </SIconWrapper>
            </STrailing>
          }
        />
      }
      body={
        <SBody>
          <SHeader>
            <WebsiteLogo large margin={"16px 0px 0px 0px"} domain={domain} />
            <STitle>{domain}</STitle>
            <SSubtitle>{getCount()}</SSubtitle>
          </SHeader>
          {Object.entries(labels).map(([key, value]) => (
            <LabelCard key={key} margin="16px 16px 0px 16px" label={key} data={value} domain={domain} />
          ))}
        </SBody>
      }
    />
  )
}

export default WebsiteView
