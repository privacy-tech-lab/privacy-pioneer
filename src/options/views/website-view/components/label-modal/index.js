import React, { useRef } from "react"
import LabelDetail from "../../../../../libs/label-detail"
import { IconWrapper, SBackdrop, SLeading, SMiddle, SModal, SNavigationBar, STitle, STrailing } from "./style"
import * as Icons from "../../../../../libs/icons"
import { AnimatePresence } from "framer-motion"
import { privacyLabels } from "../../../../../background/analysis/classModels"

/**
 * Modal popup detailing information collected and shared.
 * Destination after clicking a 'label card'
 */
const LabelModal = ({ show, setModal, label, requests, website }) => {
  const backdropRef = useRef()

  return (
    <AnimatePresence>
      {show ? (
        <SBackdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, type: "tween", ease: "easeOut" }}
          ref={backdropRef}
          onClick={(event) => {
            if (backdropRef.current === event.target) setModal({ show: false })
          }}
        >
          <SModal>
            <SNavigationBar>
              <SLeading />
              <SMiddle>
                {Icons.getLabelIcon(label)}
                <STitle>{privacyLabels[label]["displayName"]}</STitle>
              </SMiddle>
              <STrailing>
                <IconWrapper onClick={() => setModal({ show: false })}>
                  <Icons.Close size="24px" />
                </IconWrapper>
              </STrailing>
            </SNavigationBar>
            <LabelDetail website={website} label={label} requests={requests} />
          </SModal>
        </SBackdrop>
      ) : null}
    </AnimatePresence>
  )
}

export default LabelModal
