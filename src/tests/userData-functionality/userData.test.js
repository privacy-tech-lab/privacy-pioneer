import { getLocationData } from "../../background/analysis/buildUserData/getLocationData.js";
import { getWatchlistDict, hashUserDictValues, createKeywordObj} from "../../background/analysis/buildUserData/structureUserData.js";
import analysisData from "../mock-data/analysisData.json";

  test("test getLocationData", async () => {
    await expect(await getLocationData()).toBeTruthy()
    await expect((await getLocationData())[0]).toBeDefined()
    await expect((await getLocationData())[1]).toBeDefined()
  });

  test("test getWatchlistDict", async () => {
    await expect(await getWatchlistDict()).toBeTruthy()
  });

  test("test hashUserDictValues", async () => {
    const keywords = analysisData.networkKeywords
    expect(hashUserDictValues(keywords)).toBe(keywords)
    expect(hashUserDictValues(keywords).personal.ipAddress).toBeDefined()
    expect(hashUserDictValues(keywords).tracking).toBeDefined()
    expect(hashUserDictValues(keywords).tracking.fingerprinting).toBeDefined()
    expect(hashUserDictValues(keywords).tracking.trackingPixel).toBeDefined()
    expect(hashUserDictValues(keywords).location).toBeDefined()
    
  });

  test("test general hashUserDictValues", async () => {
    const general = analysisData.general
    expect(hashUserDictValues(general).personal.general[0].keywordHash).toBeTruthy()
  });

  test("test createKeywordObj", async () => {
    expect(createKeywordObj("123\\D?45\\D?678\\D?910", "ipAdress").keywordHash).toBeTruthy()
    expect(createKeywordObj("/testRegion/", "Region", "222222222").keywordHash).toBe("222222222")
  });