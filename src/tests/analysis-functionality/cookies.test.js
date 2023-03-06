import { getAllEvidenceForCookies } from "../../background/analysis/requestAnalysis/scanCookies.js"
import data from "../mock-data/mockEvidence.json"
test("test cookies",  async () => {
    const cookie = data.cookie
    const evidence = getAllEvidenceForCookies(cookie.cookies, cookie.rootUrl, cookie.reqUrl, cookie.userData)
    const cookie1 = evidence[0]
    const cookie2 = evidence[1]
    const cookie3 = evidence[2]
    const cookie4 = evidence[3]
    const cookie5 = evidence[4]
    expect(cookie1.permission).toBe("location")
    expect(cookie1.rootUrl).toBe("https://invasiveWebsite.com/")
    expect(cookie1.snippet).toBe("testCity|testRegion|12345|US|NA|-500|broadband|12.3|-45.6|")
    expect(cookie1.requestUrl).toBe("https://requestingWebsite.com/")
    expect(cookie1.typ).toBe("fineLocation")
    expect(cookie1.index).toStrictEqual([ 53, 57 ])
    expect(cookie1.cookie).toBeTruthy()
    expect(cookie1.loc).toBe("lng")

    expect(cookie2.typ).toBe("coarseLocation")

    expect(cookie3.typ).toBe("zipCode")
    expect(cookie3.index).toStrictEqual([ 20, 25 ])
    expect(cookie3.watchlistHash).toBe("222222222")

    expect(cookie4.typ).toBe("region")
    expect(cookie4.index).toStrictEqual([ 9, 19 ])

    expect(cookie5.typ).toBe("city")
    expect(cookie5.index).toStrictEqual([ 0, 8 ])    
  });