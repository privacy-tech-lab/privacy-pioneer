import React from "react"
import Scaffold from "../../components/scaffold"
import WebsiteLogo from "../../../libs/website-logo"
import LabelCard from "../../../libs/label-card"
import * as Icons from "../../../libs/icons"
import { SLeading, SBrandIcon, SBrandTitle, STrailing, SBody, SHeader, STitle, SSubtitle, SIconWrapper } from "./style"
import NavBar from "../../components/nav-bar"

const WebsiteView = () => {
  const navigate = ({ urlHash = "" }) => {
    const url = browser.runtime.getURL("options.html")
    browser.tabs.query({ url: url }, function (tabs) {
      console.log(tabs)
      if (tabs.length) {
        browser.tabs.update(tabs[0].id, { active: true, url: url + urlHash })
      } else {
        browser.tabs.create({ url: url + urlHash })
      }
    })
  }

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
                <Icons.Settings size="24px" />
              </SIconWrapper>
            </STrailing>
          }
        />
      }
      body={
        <SBody>
          <SHeader>
            <WebsiteLogo large margin={"16px 0px 0px 0px"} domain={"amazon"} />
            <STitle>www.amazon.com</STitle>
            <SSubtitle>3 privacy practices Identified</SSubtitle>
          </SHeader>
          <LabelCard margin="16px 16px 0px 16px" label="location" />
          <LabelCard margin="16px 16px 0px 16px" label="location" />
        </SBody>
      }
    />
  )
}

export default WebsiteView
