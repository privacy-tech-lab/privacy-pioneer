import React from "react"
import Scaffold from "../../components/scaffold"
import { STitle } from "./style"
import { SContainer, SSubtitle } from "./style"

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
      </SContainer>
    </Scaffold>
  )
}

export default SettingsView
