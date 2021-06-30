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
  SSwitch,
  SKnob,
  SSwitchLabel,
  SLabelToggle,
} from "./style";

const ToggleSwitch = ({ isActive, label, onClick, margin }) => (
  <div style={{ display: "flex", flexDirection: "row", margin: "12px 0px" }}>
    <SSwitchLabel>{label}</SSwitchLabel>
    <SSwitch active={isActive} onClick={onClick}>
      <SKnob
        variants={{
          off: { x: 0 },
          on: { x: 28 },
        }}
        transition={{ type: "tween" }}
        initial={isActive ? "on" : "off"}
        animate={isActive ? "on" : "off"}
      />
    </SSwitch>
  </div>
);

/**
 * Settings page view
 */
const SettingsView = () => {
  const [active, SetActive] = useState(true);
  return (
    <Scaffold>
      <SContainer>
        <STitle>Settings</STitle>
        <SSubtitle>Manage the extension</SSubtitle>
        <SBody>
          <SSection>
            <ToggleSwitch
              isActive={active}
              onClick={() => SetActive(!active)}
              label="Enabled"
            />
            <SSettingHeader>Labels</SSettingHeader>
            <SSubtitle>Toggle which labels you want to track</SSubtitle>
            <SLabelToggle>
              <ToggleSwitch
                isActive={active}
                onClick={() => SetActive(!active)}
                label="Monetization"
              />
              <ToggleSwitch
                isActive={active}
                onClick={() => SetActive(!active)}
                label="Tracking"
              />
              <ToggleSwitch
                isActive={active}
                onClick={() => SetActive(!active)}
                label="Personal Data"
              />
            </SLabelToggle>
            <SSettingHeader>Theme</SSettingHeader>
            <SSubtitle>Choose the theme of the extension</SSubtitle>
          </SSection>
          <SSeperator marginLeft="4px" marginRight="4px" />
          <SSection>TEST</SSection>
        </SBody>
      </SContainer>
    </Scaffold>
  );
};

export default SettingsView;
