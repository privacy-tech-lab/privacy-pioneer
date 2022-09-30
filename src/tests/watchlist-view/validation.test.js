/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { typeEnum } from "../../background/analysis/classModels"
import validate from "../../options/views/watchlist-view/components/edit-modal/components/input-validators"

test('Invalid Phone Number', async () => {
    const res = await validate({ keyword: "111111", keywordType: typeEnum.phoneNumber, setInputValid: () => {}, setKeyType: () => {}})
    expect(res).not.toBeTruthy();
})