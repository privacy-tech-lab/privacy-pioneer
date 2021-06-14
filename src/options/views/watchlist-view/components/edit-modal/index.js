import React, { useRef, useState, useEffect } from "react";
import {
  IconWrapper,
  SHeader,
  SLeading,
  SMiddle,
  SModal,
  SNavigationBar,
  STitle,
  STrailing,
  SType,
  SDropdown,
  SActionGroup,
  SAction,
  SDropdownSelection,
  SDropdownOptions,
  SDropdownItem,
  SContent,
  SErrorText,
} from "./style";
import * as Icons from "../../../../../libs/icons";
import { saveKeyword } from "../../../../../libs/indexed-db";
import {
  keywordTypes,
  permissionEnum,
  typeEnum,
} from "../../../../../background/analysis/classModels";
import { Modal } from "bootstrap";
import Form from "./forms";

/**
 * Popup modal to create/edit keyword
 */
const EditModal = ({ keywordType, keyword, edit, id, updateList }) => {
  const dropdownRef = useRef();
  const [showDropdown, setDropdown] = useState(false);
  const [_keywordType, setKeywordType] = useState(
    edit ? keywordType : "Select Type"
  );
  const [_keyword, setKeyword] = useState(edit ? keyword : "");
  const [_location, setLocation] = useState(edit ? keyword : {});
  const [errorText, setError] = useState("");

  /**
   * Closes dropdown when clicked outside
   */
  const blur = (event) => {
    if (!dropdownRef.current.contains(event.target)) {
      setDropdown(false);
    }
  };

  const handleAddressChange = (type, value) => {
    var newLocation = _location;
    newLocation[type] = value;
    newLocation["display"] = `${newLocation[typeEnum.address]}, ${
      newLocation[typeEnum.city]
    }, ${newLocation[typeEnum.state]} ${newLocation[typeEnum.zipCode]} `;
    setLocation(newLocation);
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
  };

  useEffect(() => {
    document.addEventListener("mousedown", blur);
    return () => document.removeEventListener("mousedown", blur);
  }, []);

  return (
    <>
      <SContent className="modal-content">
        <SModal>
          <SNavigationBar>
            <SLeading />
            <SMiddle>
              <STitle>{edit ? "Edit Keyword" : "Add Keyword"}</STitle>
            </SMiddle>
            <STrailing>
              <IconWrapper data-bs-dismiss="modal" aria-label="Close">
                <Icons.Close size="24px" />
              </IconWrapper>
            </STrailing>
          </SNavigationBar>
          <SErrorText>{errorText ? errorText : null}</SErrorText>
          <SType>
            <SHeader>TYPE</SHeader>
            <SDropdown
              ref={dropdownRef}
              onClick={() => setDropdown((state) => !state)}
            >
              <SDropdownOptions show={showDropdown}>
                {Object.keys(keywordTypes).map((key, index) => (
                  <SDropdownItem
                    onClick={() => {
                      setKeywordType(key);
                    }}
                    key={index}
                  >
                    {keywordTypes[key]["displayName"]}
                  </SDropdownItem>
                ))}
              </SDropdownOptions>
              <SDropdownSelection>
                {_keywordType in keywordTypes
                  ? keywordTypes[_keywordType]["displayName"]
                  : "Select Type"}
                <Icons.ChevronDown size="24px" />
              </SDropdownSelection>
            </SDropdown>
          </SType>
          <Form
            onAddressChange={handleAddressChange}
            onRegularChange={handleKeywordChange}
            keywordType={_keywordType}
            value={
              keywordType == permissionEnum.location ? _location : _keyword
            }
          />
          <SActionGroup>
            <SAction data-bs-dismiss="modal" aria-label="Close" color="#e57373">
              Cancel
            </SAction>
            <SAction
              onClick={async () => {
                let key =
                  _keywordType == permissionEnum.location
                    ? _location
                    : _keyword;
                if (await saveKeyword(key, _keywordType, id)) {
                  await updateList();
                  const modal = Modal.getInstance(
                    document.getElementById("edit-modal")
                  );
                  modal.hide();
                } else {
                  setError("Sorry, something went wrong!");
                }
              }}
              color="#64b5f6"
            >
              Save
            </SAction>
          </SActionGroup>
        </SModal>
      </SContent>
    </>
  );
};

export default EditModal;
