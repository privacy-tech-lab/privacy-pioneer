import React from "react";
import { SInput, SForm, SKeyword, SHeader } from "../style";
import {
  typeEnum,
  permissionEnum,
} from "../../../../../../background/analysis/classModels";
import { keywordTypes } from "../../../../../../background/analysis/classModels";

/**
 * Form for a user to input their address
 */
const AddressForm = ({ onChange, value }) => {
  return (
    <SForm>
      <SKeyword>
        <SHeader>Address</SHeader>
        <SInput
          placeholder={
            keywordTypes[permissionEnum.location]["placeholder"][
              typeEnum.streetAddress
            ]
          }
          onChange={(e) => onChange(typeEnum.streetAddress, e.target.value)}
          value={value[typeEnum.streetAddress]}
        />
      </SKeyword>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <SKeyword>
          <SHeader>City</SHeader>
          <SInput
            placeholder={
              keywordTypes[permissionEnum.location]["placeholder"][
                typeEnum.city
              ]
            }
            onChange={(e) => onChange(typeEnum.city, e.target.value)}
            value={value[typeEnum.city]}
          />
        </SKeyword>
        <SKeyword style={{ flex: 0.25 }}>
          <SHeader>State</SHeader>
          <SInput
            maxLength={2}
            placeholder={
              keywordTypes[permissionEnum.location]["placeholder"][
                typeEnum.state
              ]
            }
            onChange={(e) => onChange(typeEnum.state, e.target.value)}
            value={value[typeEnum.state]}
          />
        </SKeyword>

        <SKeyword style={{ flex: 0.5 }}>
          <SHeader>Zip</SHeader>
          <SInput
            maxLength={5}
            placeholder={
              keywordTypes[permissionEnum.location]["placeholder"][
                typeEnum.zipCode
              ]
            }
            onChange={(e) => onChange(typeEnum.zipCode, e.target.value)}
            value={value[typeEnum.zipCode]}
          />
        </SKeyword>
      </div>
    </SForm>
  );
};

/**
 * Form for a user to add their own non-location keywords
 */
const KeywordForm = ({ keywordType, onChange, value }) => {
  return (
    <SKeyword>
      <SHeader>KEYWORD</SHeader>
      <SInput
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          keywordTypes[keywordType]
            ? keywordTypes[keywordType]["placeholder"]
            : "Keyword"
        }
        value={value}
      />
    </SKeyword>
  );
};

/**
 * Chooses the form the user should see (location or normal)
 */
const Form = ({ keywordType, onAddressChange, onRegularChange, value }) => {
  return keywordType != permissionEnum.location ? (
    <KeywordForm
      keywordType={keywordType}
      onChange={onRegularChange}
      value={value}
    />
  ) : (
    <AddressForm onChange={onAddressChange} value={value} />
  );
};

export default Form;
