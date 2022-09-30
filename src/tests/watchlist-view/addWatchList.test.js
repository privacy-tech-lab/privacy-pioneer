/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { typeEnum } from "../../background/analysis/classModels";
import { watchlistKeyval } from "../../libs/indexed-db/openDB";
import { deleteKeywordDB } from "../../libs/indexed-db/settings";
import { deleteKeyword, saveKeyword } from "../../libs/indexed-db/updateWatchlist";
import validate from "../../options/views/watchlist-view/components/edit-modal/components/input-validators";

test("Add General Keyword to the watchlist", async () => {
  const word = "This is a Test"

  // Validate General Keyword
  const val = await validate({ keyword: word, keywordType: typeEnum.userKeyword, setInputValid: () => { }, setKeyType: () => { } })
  expect(val).toBeTruthy();

  // Save General Keyword to Watchlist
  const res = await saveKeyword(word, "userKeyword", "12345");
  expect(res).toBeTruthy();

  //Checks whether General Keyword was saved
  const keyword = await watchlistKeyval.get("12345");
  expect(keyword).not.toBeUndefined();
});

test('Add Email Item to the Watchlist', async () => {
  const email = "test@wesleyan.edu"

  // Validate Email
  const val = await validate({ keyword: email, keywordType: typeEnum.emailAddress, setInputValid: () => { }, setKeyType: () => { } })
  expect(val).toBeTruthy();

  //Save Email to Watchlist
  const res = await saveKeyword(email, "emailAddress", '12346')
  expect(res).toBeTruthy()

  //Checks whether Email was saved
  const keyword = await watchlistKeyval.get('12346')
  expect(keyword).not.toBeUndefined();
});

test('Add Location to Watchlist', async () => {
  const location = "45 Wyllys Ave, Middletown, Connecticut, 06457"

  //Validate Location
  const val = await validate({ keyword: location, keywordType: typeEnum.streetAddress, setInputValid: () => { }, setKeyType: () => { }, region: "Connecticut", city: "Middletown", zip: "06457", address: "45 Wyllys Ave" })
  expect(val).toBeTruthy();

  //Save Location to Watchlist
  const res = await saveKeyword(location, "location", "12349")
  expect(res).toBeTruthy()

  //Checks whether Location was saved
  const keyword = await watchlistKeyval.get("12349")
  expect(keyword).not.toBeUndefined()
});

test('Add Phone Number to Watchlist (Format: XXX-XXX-XXXX)', async () => {
  const phoneNum = "111-111-1111"
  // const phoneNummm = "111111111"  // This one does work

  //Validate Phone Numbers (Multiple Formats)
  const val = await validate({ keyword: phoneNum, keywordType: typeEnum.phoneNumber, setInputValid: () => { }, setKeyType: () => { } })
  expect(val).toBeTruthy()

  //Save Phone Number to Watchlist
  const res = await saveKeyword(phoneNum, "phoneNumber", "12350")
  expect(res).toBeTruthy()

  //Check whether Phone Number was saved to Watchlist
  const keyword = await watchlistKeyval.get("12350")
  expect(keyword).not.toBeUndefined()
});

test('Add Phone Number to Watchlist (Format: +X (XXX) XXX-XXXX)', async () => {
  const phoneNum = "+1 (111) 111-1111"

  //Validate Phone Numbers
  const val = await validate({ keyword: phoneNum, keywordType: typeEnum.phoneNumber, setInputValid: () => { }, setKeyType: () => { } })
  expect(val).toBeTruthy()

  //Save Phone Number to Watchlist
  const res = await saveKeyword(phoneNum, "phoneNumber", "12351")
  expect(res).toBeTruthy()

  //Check whether Phone Number was saved to Watchlist
  const keyword = await watchlistKeyval.get("12351")
  expect(keyword).not.toBeUndefined()
});

test('Check if invalid phone number saves', async () => {

  const res = await validate({ keyword: "11", keywordType: typeEnum.phoneNumber, setInputValid: () => { }, setKeyType: () => { } })
  expect(res).not.toBeTruthy();

});

test('Add IP Address to Watchlist', async () => {
  const ipAdd = "123.89.46.72"
  //const ipAddDos = "172.16.0.9"

  //Validate Location
  const val = await validate({ keyword: ipAdd, keywordType: typeEnum.ipAddress, setInputValid: () => { }, setKeyType: () => { } })
  expect(val).toBeTruthy();

  //Save IP to Watchlist
  const res = await saveKeyword(ipAdd, "ipAddress", "12349")
  expect(res).toBeTruthy()

  //Checks whether Location was saved
  const keyword = await watchlistKeyval.get("12349")
  expect(keyword).not.toBeUndefined()
});

test('Watchlist Removes all Items', async () => {
  await saveKeyword("This is a Test", "userKeyword", '12345');
  await saveKeyword("This is a Test2", "userKeyword", '12346');
  expect(await watchlistKeyval.get('12345')).not.toBeUndefined();
  await deleteKeywordDB()
  expect(await watchlistKeyval.get('12345')).toBeUndefined();
  expect(await watchlistKeyval.get('12346')).toBeUndefined();

});
