import React, { useState } from "react";
import Scaffold from "../../components/scaffold";
import {
  STitle,
  SContainer,
  SSubtitle,
  SSettingHeader,
  SBody,
  SSection,
  SSeperator,
} from "./style";
import {
  ToggleSwitch,
  ThemeSelection,
  ExportData,
  DangerZone,
  LabelToggle,
} from "./components";

/**
 * Settings page view
 */
const SettingsView = ({ changeTheme }) => {
  return (
    <Scaffold>
      <SContainer>
        <STitle>Settings</STitle>
        <SSubtitle>Manage the extension</SSubtitle>
        <SBody>
          <SSection>
            {/* <ToggleSwitch label="Enabled" /> */}
            <SSettingHeader>Labels</SSettingHeader>
            <SSubtitle>Toggle which labels you want to track</SSubtitle>
            <LabelToggle />
            <SSettingHeader>Theme</SSettingHeader>
            <SSubtitle>Choose the theme of the extension</SSubtitle>
            <ThemeSelection changeTheme={changeTheme} />
          </SSection>
          <SSeperator marginLeft="32px" marginRight="32px" />
          <SSection>
            <div>
              <SSettingHeader>Export Data</SSettingHeader>
              <SSubtitle>
                Export all of the data and evidence accumulated through
                extension
              </SSubtitle>
              <ExportData />
            </div>
            <DangerZone />
          </SSection>
        </SBody>
      </SContainer>
    </Scaffold>
  );
};

export default SettingsView;
