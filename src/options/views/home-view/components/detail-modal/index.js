/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import React from "react"
import LabelDetail from "../../../../../libs/components/label-detail"
import {
  IconWrapper,
  SLeading,
  SMiddle,
  SModal,
  SNavigationBar,
  STitle,
  STrailing,
  SContainer,
  SDialog,
  SContent,
} from "./style"
import * as Icons from "../../../../../libs/icons"
import { privacyLabels } from "../../../../../background/analysis/classModels"

/**
 * Modal popup detailing information collected and shared.
 * Destination after clicking a 'label card'
 */
const LabelModal = ({ label, requests, website, show }) => {
  return (
    <>
      <SContainer
        className="modal fade"
        id="detail-modal"
        tabIndex="-1"
        aria-labelledby="detail-modal"
        aria-hidden="true"
      >
        <SDialog className="modal-dialog">
          <SContent className="modal-content">
            {show ? (
              <SModal>
                <SNavigationBar>
                  <SLeading />
                  <SMiddle>
                    {Icons.getLabelIcon(label)}
                    <STitle>{privacyLabels[label]["displayName"]}</STitle>
                  </SMiddle>
                  <STrailing>
                    <IconWrapper data-bs-dismiss="modal" aria-label="Close">
                      <Icons.Close size="24px" />
                    </IconWrapper>
                  </STrailing>
                </SNavigationBar>
                <LabelDetail
                  website={website}
                  label={label}
                  requests={requests}
                />
              </SModal>
            ) : null}
          </SContent>
        </SDialog>
      </SContainer>
    </>
  )
}

export default LabelModal
