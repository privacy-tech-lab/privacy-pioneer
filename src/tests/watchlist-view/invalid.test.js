/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { typeEnum } from "../../background/analysis/classModels"
import validate from "../../options/views/watchlist-view/components/edit-modal/components/input-validators"

test('Invalid Phone Number', async () => {
    const phoneNum = "111111"
    
    //Check if Phone Number is valid
    const res = await validate({ keyword: phoneNum, keywordType: typeEnum.phoneNumber, setInputValid: () => {}, setKeyType: () => {}})

    //Expect Phone Number to not be valid
    expect(res).not.toBeTruthy();

})

test('Invalid Email Address', async () => {
    const email = "botwesleyan"

    //Check if Email is valid
    const res = await validate({ keyword: email, keywordType: typeEnum.emailAddress, setInputValid: () => {}, setKeyType: () => {}})
    
    //Expect Email to not be valid
    expect(res).not.toBeTruthy();
})

test('Invalid Keyword', async () => {
    const key = "ww" //Length should be 5 or more

    //Check if keyword is valid
    const res = await validate({ keyword: key, keywordType: typeEnum.userKeyword, setInputValid: () => {}, setKeyType: () => {}})
    
    //Expect keyword to not be valid
    expect(res).not.toBeTruthy();
})

test('Invalid IP Address', async () => {
    const ip = "123.1233.222"

    //Check if IP is valid
    const res = await validate({ keyword: ip, keywordType: typeEnum.ipAddress, setInputValid: () => {}, setKeyType: () => {}})
    
    //Expect IP to not be valid
    expect(res).not.toBeTruthy();
})


