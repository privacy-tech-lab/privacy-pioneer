import { apiIPToken } from "../../libs/holdAPI.js";
import { getLocationData } from "../../background/analysis/buildUserData/getLocationData.js";
import { getWatchlistDict, hashUserDictValues, createKeywordObj} from "../../background/analysis/buildUserData/structureUserData.js";
import analysisData from "../mock-data/analysisData.json";

  test("test getLocationData", async () => {
    await expect(await getLocationData()).toBeTruthy()
  });

  test("test getWatchlistDict", async () => {
    await expect(await getWatchlistDict()).toBeTruthy()
  });

  test("test hashUserDictValues", async () => {
    const keywords = analysisData.networkKeywords
    expect(hashUserDictValues(keywords)).toBe(keywords)
    
  });

  test("test general hashUserDictValues", async () => {
    const general = analysisData.general
    expect(hashUserDictValues(general).watchlist.general[0].keywordHash).toBeTruthy()
  });

  test("test createKeywordObj", async () => {
    expect(createKeywordObj("123\\D?45\\D?678\\D?910", "ipAdress").keywordHash).toBeTruthy()
    expect(createKeywordObj("/testRegion/", "Region", "222222222").keywordHash).toBe("222222222")
  });