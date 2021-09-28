import React, { useEffect } from "react"
import { SInput, SInputContainer, SSearchContainer } from "./style"
import * as Icons from "../../../../../../libs/icons"

const SearchBar = ({
  setQuery,
  placeholder,
  setPlaceholder,
  filter,
  getPlaceholder,
}) => {
  useEffect(() => {
    setPlaceholder(getPlaceholder())
  }, [])

  return (
    <SSearchContainer>
      <SInputContainer>
        <Icons.Search size={24} />
        <SInput
          placeholder={placeholder}
          onChange={(e) => {
            filter(e.target.value)
            setQuery(e.target.value)
          }}
        />
      </SInputContainer>
    </SSearchContainer>
  )
}

export default SearchBar
