import React from "react"
import Scaffold from "../../components/scaffold"
import { STitle } from "./style"
import { SContainer, SSubtitle } from "./style"

const AboutView = () => {
  return (
    <Scaffold>
      <SContainer>
        <STitle>About</STitle>
        <SSubtitle>
          Learn more about our extension
        </SSubtitle>
      </SContainer>
    </Scaffold>
  )
}

export default AboutView
