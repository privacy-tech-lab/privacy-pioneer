import {
  coordinateSearch,
  urlSearch,
  locationKeywordSearch,
  fingerprintSearch,
  ipSearch,
  pixelSearch,
  dynamicPixelSearch,
  encodedEmailSearch,
} from "../../background/analysis/requestAnalysis/searchFunctions.js";
import mockSearchData from "../mock-data/mockSearchData.json";
import {
  setEmail,
  digestMessage,
  hexToBase64,
} from "../../background/analysis/requestAnalysis/encodedEmail.js";
test("test coordinateSearch", async () => {
  const coordSeaarch = mockSearchData.coordinateSearch;
  const output = coordinateSearch(
    coordSeaarch.strReq,
    coordSeaarch.locData,
    coordSeaarch.rootUrl,
    coordSeaarch.reqUrl
  );
  const lng = output[0];
  expect(lng.permission).toBe("location");
  expect(lng.rootUrl).toBe("invasiveWebsite.com");
  expect(lng.snippet).toBe(
    "test test test {latitude: 12.3, longitude: -45.6} test test test"
  );
  expect(lng.requestUrl).toBe("https://invasiveWebsite.com/getCoorinates");
  expect(lng.typ).toBe("fineLocation");
  expect(lng.index).toStrictEqual([44, 48]);
  expect(lng.loc).toBe("lng");
});

test("test urlSearch", async () => {
  const url_Search = mockSearchData.urlSearch;
  const output = urlSearch(
    url_Search.rootUrl,
    url_Search.reqUrl,
    url_Search.classifications
  );
  const outputObj = output[0];
  expect(outputObj.permission).toBe("monetization");
  expect(outputObj.rootUrl).toBe("https://invasiveWebsite.com/");
  expect(outputObj.requestUrl).toBe("https://requestingWebsite.com/");
  expect(outputObj.typ).toBe("advertising");
});

test("test locationKeywordSearch", async () => {
  const locationSearch = mockSearchData.locationKeywordSearch;
  const output = locationKeywordSearch(
    locationSearch.strReq,
    locationSearch.locElems,
    locationSearch.rootUrl,
    locationSearch.reqUrl
  );
  const zip = output[0];
  expect(zip.permission).toBe("location");
  expect(zip.rootUrl).toBe("https://invasiveWebsite.com/");
  expect(zip.snippet).toBe(
    "6789 test test test 12345 test test test testRegion test test test test testCity test test test 6789 1 Test Road abcde 123"
  );
  expect(zip.requestUrl).toBe("https://requestingWebsite.com/");
  expect(zip.typ).toBe("zipCode");
  expect(zip.watchlistHash).toBe("222222222");
  expect(zip.index).toStrictEqual([20, 25]);
  const region = output[1];
  expect(region.typ).toBe("region");
  expect(region.index).toStrictEqual([41, 51]);
  const city = output[2];
  expect(city.typ).toBe("city");
  expect(city.index).toStrictEqual([72, 80]);
});

test("test streetAddressSearch", async () => {
  const locationSearch = mockSearchData.locationKeywordSearch;
  const output = locationKeywordSearch(
    locationSearch.strReq,
    locationSearch.locElems,
    locationSearch.rootUrl,
    locationSearch.reqUrl
  );
  const address = output[3];
  expect(address.permission).toBe("location");
  expect(address.rootUrl).toBe("https://invasiveWebsite.com/");
  expect(address.snippet).toBe(
    "6789 test test test 12345 test test test testRegion test test test test testCity test test test 6789 1 Test Road abcde 123"
  );
  expect(address.requestUrl).toBe("https://requestingWebsite.com/");
  expect(address.typ).toBe("streetAddress");
  expect(address.watchlistHash).toBe("222222222");
  expect(address.index).toStrictEqual([101, 112]);
});

test("test ipSearch", async () => {
  const ip_search = mockSearchData.ipSearch;
  const output = ipSearch(
    ip_search.strReq,
    ip_search.ipObj,
    ip_search.rootUrl,
    ip_search.reqUrl
  );
  const ip = output[0];
  expect(ip.permission).toBe("tracking");
  expect(ip.snippet).toBe(
    "6789 test test test 12345 test test test 108-26-182-44 test test test test 12345 test test test 6789 "
  );
  expect(ip.typ).toBe("ipAddress");
  expect(ip.index).toStrictEqual([41, 54]);
});

test("test pixelSearch", async () => {
  const pixel_Search = mockSearchData.pixelSearch;
  const output = pixelSearch(
    pixel_Search.strReq,
    pixel_Search.networkKeywords,
    pixel_Search.rootUrl,
    pixel_Search.reqUrl
  );
  const pixel = output[0];
  expect(pixel.permission).toBe("tracking");
  expect(pixel.snippet).toBe(
    "https://www.google-analytics.com/collect123abc123abc"
  );
  expect(pixel.typ).toBe("trackingPixel");
  expect(pixel.index).toStrictEqual([-1, 63]);
});

test("test dynamicPixelSearch", async () => {
  const dynamicPixel_Search = mockSearchData.dynamicPixelSearch;
  const output = dynamicPixelSearch(
    dynamicPixel_Search.strReq,
    dynamicPixel_Search.reqUrl,
    dynamicPixel_Search.rootUrl
  );
  const pixel = output[0];
  expect(pixel.permission).toBe("tracking");
  expect(pixel.typ).toBe("possiblePixel");
  expect(pixel.index).toStrictEqual([11, 132]);
});

test("test fingerprintSearch", async () => {
  const fingerprint_Search = mockSearchData.fingerPrintSearch;
  const output = fingerprintSearch(
    fingerprint_Search.strReq,
    fingerprint_Search.networkKeywords,
    fingerprint_Search.reqUrl,
    fingerprint_Search.rootUrl
  );
  expect(output[0].permission).toBe("tracking");
  expect(output[0].rootUrl).toBe(
    "https://www.google-analytics.com/collect//requestingWebsite.com/"
  );
  expect(output[0].snippet).toBe(
    "123456789abcdefgFingerprint2123456789abcdefg"
  );
  expect(output[0].typ).toBe("fingerprinting");
  expect(output[0].index).toStrictEqual([16, 28]);
});
