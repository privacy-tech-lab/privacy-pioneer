/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { typeEnum } from "../../background/analysis/classModels"
import validate from "../../options/views/watchlist-view/components/edit-modal/components/input-validators"

test('Invalid Phone Number', async () => {
    const phoneNum = "111111"
    const res = await validate({ keyword: phoneNum, keywordType: typeEnum.phoneNumber, setInputValid: () => {}, setKeyType: () => {}})
    expect(res).not.toBeTruthy();
})

test('Invalid Email Address', async () => {
    const email = "botwesleyan"
    //bot@wesleyan is good though
    const res = await validate({ keyword: email, keywordType: typeEnum.emailAddress, setInputValid: () => {}, setKeyType: () => {}})
    expect(res).not.toBeTruthy();
})

test('Invalid Keyword', async () => {
    const key = "ww" //Length should be 5 or more

    const res = await validate({ keyword: key, keywordType: typeEnum.userKeyword, setInputValid: () => {}, setKeyType: () => {}})
    expect(res).not.toBeTruthy();
})

test('Invalid IP Address', async () => {
    const ip = "123.1233.222"
    const res = await validate({ keyword: ip, keywordType: typeEnum.ipAddress, setInputValid: () => {}, setKeyType: () => {}})
    expect(res).not.toBeTruthy();
})

test('Invalid Location', async () => {
    const location = "45"

    const val = await validate({ keyword: location, keywordType: typeEnum.streetAddress, setInputValid: () => { }, setKeyType: () => { }, region: "", city: "", zip: "", address: location })
    expect(val).not.toBeTruthy();
}) //Have to fix this case