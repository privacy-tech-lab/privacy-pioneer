/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import {
  typeEnum,
  permissionEnum,
} from "../../../../../../background/analysis/classModels.js"
import {
  regionObj,
  getRegion,
} from "../../../../../../background/analysis/buildUserData/structuredRoutines.js"
// allows for input validation of items a user is attempting to add to their watch list

const inputValidator = {
  numRegex: new RegExp(
    /\d?(\s?|-?|\+?|\.?)((\(\d{1,4}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)((\(\d{1,3}\))|(\d{1,3})|\s?)(\s?|-?|\.?)\d{3}(-|\.|\s)\d{4}/
  ),
  numRegex2: new RegExp(/\d{10}/),
  emailRegex: new RegExp(
    /^[a-zA-Z0-9.!#$%&'*+/:?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  ),
  emailRegex2: new RegExp(
    /^([a-zA-Z0-9]+(?:[+.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,7})$/
  ),
  ipRegex_4: new RegExp(
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  ),
  ipRegex_6: new RegExp(
    /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$|^[0-9a-fA-F]{1,4}:[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,3}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:){0,2}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,4}[0-9a-fA-F]{1,4}::(?:[0-9a-fA-F]{1,4}:)?[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}::[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}::$/
  ),
  userKeyword: new RegExp(/.{5,}/),
  zipCode: new RegExp(/\d{5}/),
  city_address: new RegExp(/.{3,}/),
}

/**
 * Validate a user input
 */
const validate = ({
  keyword,
  keywordType,
  setInputValid,
  setKeyType,
  city,
  region,
  zip,
  address,
}) => {
  /**
   * Reset the form if the input is not valid
   */
  const badInput = (type) => {
    setInputValid(false)
    setKeyType(type)
  }

  if (
    keywordType == typeEnum.phoneNumber &&
    !(
      inputValidator.numRegex.test(keyword) ||
      inputValidator.numRegex2.test(keyword)
    )
  ) {
    badInput("phone number")
    return false
  } else if (
    keywordType == typeEnum.emailAddress &&
    !(
      inputValidator.emailRegex.test(keyword) ||
      inputValidator.emailRegex2.test(keyword)
    )
  ) {
    badInput("email address")
    return false
  } else if (
    keywordType == typeEnum.ipAddress &&
    !(
      inputValidator.ipRegex_4.test(keyword) ||
      inputValidator.ipRegex_6.test(keyword)
    )
  ) {
    badInput("IP address")
    return false
  } else if (
    keywordType == typeEnum.userKeyword &&
    !inputValidator.userKeyword.test(keyword)
  ) {
    badInput("keyword. Length should be 5 or greater.")
    return false
  } else if (keywordType == permissionEnum.location) {
    if (
      (!zip == undefined && !inputValidator.zipCode.test(zip)) ||
      !zip == undefined
    ) {
      badInput("zip code")
      return false
    }
    if (!(region == undefined || region in regionObj)) {
      badInput("region abbreviation")
      return false
    }
    if (zip != undefined && region != undefined) {
      const st = getRegion(zip)
      if (typeof(st) != "undefined" && st[0] != region) {
        badInput("region / zip combination")
        return false
      }
    }
    if (!inputValidator.city_address.test(city)) {
      badInput("city")
      return false
    }
    if (!inputValidator.city_address.test(address)) {
      badInput("address")
      return false
    }
    return true
  } else return true
}

export default validate
