/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

test("Good", async () => {
    const word = "Lemonade"
    expect(word).toContain("Lemon")
})