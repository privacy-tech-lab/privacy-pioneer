import { watchlistKeyval } from "../../libs/indexed-db/openDB";
import { saveKeyword } from "../../libs/indexed-db/updateWatchlist";

test('add general item to the watchlist', async () => {
    const res = await saveKeyword("This is a Test", "userKeyword", '12345')
    expect(res).toBeTruthy()
    const keyword = await watchlistKeyval.get('12345')
    expect(keyword).not.toBeUndefined();
});