/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React, { useEffect } from "react";
import { SInput, SInputContainer, SSearchContainer } from "./style";
import * as Icons from "../../../../../../../libs/icons";

/**
 * Filters Viewed Websites based on typed input on Search bar
 */
const SearchBar = ({
  onChange,
  placeholder,
}) => {

  return (
    <SSearchContainer>
      <SInputContainer>
        <Icons.Search size={24} />
        <SInput
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value)
          }}
        />
      </SInputContainer>
    </SSearchContainer>
  );
};

export default SearchBar;
