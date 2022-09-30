/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://privacytechlab.org/
*/

import { useState } from "react";
import { permissionEnum } from "../../background/analysis/classModels"

test("Good", async () => {
    const word = "Lemonade"
    expect(word).toContain("Lemon")
})

/*
test("Remove General Keyword from the Watchlist", async () => {
    const [labelStatus, SetLabelStatus] = useState({
        [permissionEnum.location]: true,
        [permissionEnum.monetization]: true,
        [permissionEnum.watchlist]: true,
        [permissionEnum.tracking]: true,
      });
    

      expect(labelStatus["location"]).not.toBeTruthy();

}) */