import { createGlobalStyle } from "styled-components"

export default createGlobalStyle`
  :root {
    /* Colors */
    --primaryBrandColor: #6B219F;
    --primaryBrandTintColor: #F2E8F9;
    --backgroundColor: #ffffff;
    --tertiaryBackgroundColor: #f2f2f7;
    --primaryTextColor: #000000;
    --secondaryTextColor: #3c3c43;
    --cardColor: #f2f2f7;
    --seperatorColor: #c6c6c8;

    /* Font Sizes */
    --title1: 24px;
    --title2: 20px;
    --headline: 18px;
    --body1: 16px;
    --body2: 14px;
  }

  /* Dark Mode */
  @media (prefers-color-scheme: dark) {
    :root {
      --backgroundColor: #1c1c1e;
      --tertiaryBackgroundColor: #2c2c2e;
      --primaryTextColor: #ffffff;
      --secondaryTextColor: #ebebf5;
      --cardColor: #2c2c2e;
      --seperatorColor: #38383a;
    }
  }

  body {
    height: 600px;
    width: ${(props) => (props.popup ? "360px" : "1024px")};
    background-color: var(--backgroundColor);
    color: var(--primaryTextColor);
    font-size: var(--body1);
    overflow-x: hidden;
  }

  path, circle {
    fill: var(--primaryTextColor);
  }
`
