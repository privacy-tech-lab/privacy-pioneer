import React from "react"
import { typeEnum } from "../../../background/analysis/classModels"
import { saveKeyword, WatchlistKeyval } from "../../../libs/indexed-db"
import Scaffold from "../../components/scaffold"
import { SAddButton } from "../watchlist-view/style"
import { STitle } from "./style"
import { SContainer, SSubtitle } from "./style"

const getIP = async () => {
  await fetch('http://ip-api.com/json/').then(data => data.json()).then(async function (data) {
  const myIP = data.query
  if (await saveKeyword(myIP, typeEnum.ipAddress, null)) {
    await updateList();
  }
  })
}


/**
 * Settings page view
 */
const SettingsView = () => {
  return (
    <Scaffold>
      <SContainer>
        <STitle>Settings</STitle>
        <SSubtitle>
          Manage the extension
        </SSubtitle>
        <SAddButton
          onClick={
            getIP()
          }
        >
          add ip
        </SAddButton>
      </SContainer>
    </Scaffold>
  )
}

export default SettingsView
