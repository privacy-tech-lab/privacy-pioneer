/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { watchlistKeyval } from "../../libs/indexed-db/openDB";
import { deleteKeyword, saveKeyword } from "../../libs/indexed-db/updateWatchlist"


test("Remove General Keyword from the Watchlist", async () => {
    const generalKeyword = "This is a Test"
    
    //Saves General Keyword
    const res = await saveKeyword(generalKeyword, "userKeyword", "12345");
    expect(res).toBeTruthy()

    //Removes General Keyword
    await watchlistKeyval.delete("12345");

    //Checks whether General Keyword is in Watchlist
    const keyword = await watchlistKeyval.get("12345")
    expect(keyword).toBeUndefined();

});

test('Remove Email Item from Watchlist', async () => {
    const email = "test@wesleyan.edu"
  
    //Save Email to Watchlist
    const res = await saveKeyword(email, "emailAddress", '12346')
    expect(res).toBeTruthy()
  
    //Removes General Keyword
    await watchlistKeyval.delete("12346");

    //Checks whether General Keyword is in Watchlist
    const keyword = await watchlistKeyval.get("12346")
    expect(keyword).toBeUndefined();
  });

  test('Remove Location from Watchlist', async () => {
    const location = "45 Wyllys Ave, Middletown, Connecticut, 06457"
  
    //Save Location to Watchlist
    const res = await saveKeyword(location, "location", "12349")
    expect(res).toBeTruthy();
  
    //Removes Location
    await watchlistKeyval.delete("12349");

    //Checks whether Location is in Watchlist
    const keyword = await watchlistKeyval.get("12349")
    expect(keyword).toBeUndefined();
  });

  test('Remove Phone Number to Watchlist (Format: XXX-XXX-XXXX)', async () => {
    const phoneNum = "111-111-1111"
    
    //Save Phone Number to Watchlist
    const res = await saveKeyword(phoneNum, "phoneNumber", "12350")
    expect(res).toBeTruthy();

    //Removes Phone Number from Watchlist
    await watchlistKeyval.delete("12350");
  
    //Checks whether Phone Number is in Watchlist
    const keyword = await watchlistKeyval.get("12350")
    expect(keyword).toBeUndefined();
  });

  test('Remove Phone Number to Watchlist (Format: +X (XXX) XXX-XXXX)', async () => {
    const phoneNum = "+1 (111) 111-1111"
    
    //Save Phone Number to Watchlist
    const res = await saveKeyword(phoneNum, "phoneNumber", "12351")
    expect(res).toBeTruthy();

    //Removes Phone Number from Watchlist
    await watchlistKeyval.delete("12351");
  
    //Checks whether Phone Number is in Watchlist
    const keyword = await watchlistKeyval.get("12351")
    expect(keyword).toBeUndefined();
  });

  test('Remove IP Address from Watchlist', async () => {
    const ipAdd = "123.89.46.72"
    //const ipAddDos = "172.16.0.9"
  
    //Save IP to Watchlist
    const res = await saveKeyword(ipAdd, "ipAddress", "12349")
    expect(res).toBeTruthy()

    //Removes IP Address from Watchlist
    await watchlistKeyval.delete("12349");
  
    //Checks whether IP Address is in Watchlist
    const keyword = await watchlistKeyval.get("12349")
    expect(keyword).toBeUndefined()
  });

  