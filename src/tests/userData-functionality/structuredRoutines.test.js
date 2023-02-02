import {  buildPhone,
    getRegion,
    buildIpRegex,
    buildZipRegex,
    buildGeneralRegex,
} from "../../background/analysis/buildUserData/structuredRoutines"
  test("test getRegion", async () => {
    expect(getRegion("California")).toStrictEqual(/California/i)
    expect(getRegion("South-Dakota")).toStrictEqual(/South\D?Dakota/i)
    expect(getRegion("Test.Region")).toStrictEqual(/Test\D?Region/i)
  });

  test("test getIpRegex", async () => {
    expect(buildIpRegex("123-456-78-90")).toStrictEqual(/123\D?456\D?78\D?90/)
    expect(buildIpRegex("123X456Y78Z90")).toStrictEqual(/123\D?456\D?78\D?90/)
    expect(buildIpRegex("123 456 78 90")).toStrictEqual(/123\D?456\D?78\D?90/)
  });

  test("test buildZipRegex", async () => {
    expect(buildZipRegex("12345")).toStrictEqual(/[^0-9]12345[^0-9]/)
    expect(buildZipRegex("abcde")).toStrictEqual(/abcde/)
    expect(buildZipRegex("123 456")).toStrictEqual(/[^0-9]123\D?456[^0-9]/)
  });

  test("test buildGeneralRegex", async () => {
    expect(buildGeneralRegex("myEmail@gmail.com")).toStrictEqual(/myEmail.?gmail.?com/)
    expect(buildGeneralRegex("(123)-456-7890")).toStrictEqual(/.?123.?.?456.?7890/)
    expect(buildGeneralRegex("123abc")).toStrictEqual( /123abc/)
  });

  test("test buildPhoneRegex", async () => {
    expect(buildGeneralRegex("myEmail@gmail.com")).toStrictEqual(/myEmail.?gmail.?com/)
    expect(buildGeneralRegex("(123)-456-7890")).toStrictEqual(/.?123.?.?456.?7890/)
    expect(buildGeneralRegex("123abc")).toStrictEqual( /123abc/)
  });