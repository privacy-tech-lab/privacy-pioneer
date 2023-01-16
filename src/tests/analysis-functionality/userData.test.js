import { apiIPToken } from "../../libs/holdAPI.js";
import { getLocationData } from "../../background/analysis/buildUserData/getLocationData.js";
import { getWatchlistDict, hashUserDictValues} from "../../background/analysis/buildUserData/structureUserData.js";
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