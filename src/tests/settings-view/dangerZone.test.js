/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { watchlistKeyval } from "../../libs/indexed-db/openDB"
import { deleteKeywordDB } from "../../libs/indexed-db/settings"
import { saveKeyword } from "../../libs/indexed-db/updateWatchlist"

test('Watchlist Removes all Items', async () => {
    const word = "This is a Test"
    const location = "45 Wyllys Ave, Middletown, Connecticut, 06457"
    const phoneNum = "111-111-1111"
    const ipAdd = "123.89.46.72"
    const email = "test@wesleyan.edu"

    //Save Keywords
    await saveKeyword(word, "userKeyword", "12345");
    await saveKeyword(location, "location", "12346");
    await saveKeyword(phoneNum, "phoneNumber", "12347");
    await saveKeyword(ipAdd, "ipAddress", "12348");
    await saveKeyword(email, "emailAddress", '12349');
    
    //Check Keywords are in Watchlist
    expect(await watchlistKeyval.get('12345')).not.toBeUndefined();
    expect(await watchlistKeyval.get('12346')).not.toBeUndefined();
    expect(await watchlistKeyval.get('12347')).not.toBeUndefined();
    expect(await watchlistKeyval.get('12348')).not.toBeUndefined();
    expect(await watchlistKeyval.get('12349')).not.toBeUndefined();

    //Remove All Items in Watchlist
    await deleteKeywordDB();

    //Check that there is nothing in Watchlist
    expect(await watchlistKeyval.get('12345')).toBeUndefined();
    expect(await watchlistKeyval.get('12346')).toBeUndefined();
    expect(await watchlistKeyval.get('12347')).toBeUndefined();
    expect(await watchlistKeyval.get('12348')).toBeUndefined();
    expect(await watchlistKeyval.get('12349')).toBeUndefined();
  })