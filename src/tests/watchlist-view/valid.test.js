/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { typeEnum } from "../../background/analysis/classModels"
import validate from "../../options/views/watchlist-view/components/edit-modal/components/input-validators"

test('Valid Phone Number', async () => {
    const phoneNum = "+1 (111) 111-1111"
    
    //Check if Phone Number is valid
    const res = await validate({ keyword: phoneNum, keywordType: typeEnum.phoneNumber, setInputValid: () => {}, setKeyType: () => {}})

    //Expect Phone Number to be valid
    expect(res).toBeTruthy();

})

test('Valid Email Address', async () => {
    const email = "bot@wesleyan.com"

    //Check if Email is valid
    const res = await validate({ keyword: email, keywordType: typeEnum.emailAddress, setInputValid: () => {}, setKeyType: () => {}})
    
    //Expect Email to be valid
    expect(res).toBeTruthy();
})

test('Valid Keyword', async () => {
    const key = "Privacy Pioneer" //Length should be 5 or more

    //Check if keyword is valid
    const res = await validate({ keyword: key, keywordType: typeEnum.userKeyword, setInputValid: () => {}, setKeyType: () => {}})
    
    //Expect keyword to be valid
    expect(res).toBeTruthy();
})

test('Invalid IP Address', async () => {
    const ip = "123.89.46.72"

    //Check if IP is valid
    const res = await validate({ keyword: ip, keywordType: typeEnum.ipAddress, setInputValid: () => {}, setKeyType: () => {}})
    
    //Expect IP to be valid
    expect(res).toBeTruthy();
})
