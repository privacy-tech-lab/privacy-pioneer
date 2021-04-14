import React from "react"
import { SLeading, SMiddle, SNav, STrailing } from "./style"

const NavBar = ({ leading, middle, trailing }) => {
  return (
    <SNav middle={middle}>
      {leading && <SLeading>{leading}</SLeading>}
      {middle && <SMiddle>{middle}</SMiddle>}
      {(trailing || middle) && <STrailing middle={middle}>{trailing}</STrailing>}
    </SNav>
  )
}

export default NavBar
