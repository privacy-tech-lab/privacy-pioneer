import React, { useRef } from "react"
import LabelDetail from "../../../../../libs/label-detail"
import { IconWrapper, SBackdrop, SLeading, SMiddle, SModal, SNavigationBar, STitle, STrailing } from "./style"
import * as Icons from "../../../../../libs/icons"
import { AnimatePresence } from "framer-motion"
import { privacyLabels } from "../../../../../libs/constants"

const Modal = (props) => {
  const backdropRef = useRef()

  const dismissModal = (event) => {
    if (backdropRef.current === event.target) props.setShowModal({ show: false })
  }

  return (
    <SBackdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, type: "tween", ease: "easeOut" }}
      ref={backdropRef}
      onClick={dismissModal}
    >
      <SModal>
        <SNavigationBar>
          <SLeading />
          <SMiddle>
            {Icons.getLabelIcon(props.label)}
            <STitle>{privacyLabels[props.label]["displayName"]}</STitle>
          </SMiddle>
          <STrailing>
            <IconWrapper onClick={() => props.setShowModal({ show: false })}>
              <Icons.Close size="24px" />
            </IconWrapper>
          </STrailing>
        </SNavigationBar>
        <LabelDetail domain={props.domain} label={props.label} details={props.details} />
      </SModal>
    </SBackdrop>
  )
}

const LabelModal = (props) => {
  return (
    <AnimatePresence>
      {props.showModal ? (
        <Modal domain={props.domain} label={props.label} details={props.details} setShowModal={props.setShowModal} />
      ) : null}
    </AnimatePresence>
  )
}

export default LabelModal
