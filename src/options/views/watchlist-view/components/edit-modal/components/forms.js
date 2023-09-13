/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import React from "react";
import { SInput, SForm, SKeyword, SHeader } from "../style";
import {
  typeEnum,
  permissionEnum,
} from "../../../../../../background/analysis/classModels";
import { keywordTypes } from "../../../../../../background/analysis/classModels";

/**
 * Form for a user to input their address
 * @param {object} obj
 * @param {function(string,string):void} obj.onChange
 * @param {string} obj.city
 * @param {string} obj.region
 * @param {string} obj.zip
 * @param {string} obj.streetAddress
 */
export const AddressForm = ({ onChange, city, region, zip, streetAddress }) => {
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
          value={streetAddress}
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
            value={city}
          />
        </SKeyword>
        <SKeyword style={{ flex: 0.5 }}>
          <SHeader>State/Region</SHeader>
          <SInput
            placeholder={
              keywordTypes[permissionEnum.location]["placeholder"][
                typeEnum.region
              ]
            }
            onChange={(e) => onChange(typeEnum.region, e.target.value)}
            value={region}
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
            value={zip}
          />
        </SKeyword>
      </div>
    </SForm>
  );
};

/**
 * Form for a user to add their own non-location keywords
 * @param {object} obj
 * @param {string} obj.keywordType
 * @param {function(string):void} obj.onChange
 * @param {string} obj.value
 */
export const KeywordForm = ({ keywordType, onChange, value }) => {
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