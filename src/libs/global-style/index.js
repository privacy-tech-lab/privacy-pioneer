import { createGlobalStyle, css } from "styled-components";
import { getTheme, settingsEnum } from "../settings";

/**
 * Global style targeted for popup
 */
const Popup = css`
  body {
    height: 600px;
    width: 360px;
    background-color: var(--backgroundColor);
    color: var(--primaryTextColor);
    font-size: var(--body1);
    overflow-x: hidden;
    font-family: "Source Sans Pro", sans-serif;
    line-height: normal;
  }
`;

/**
 * Global style targeted for options page
 */
const Options = css`
  body {
    padding: 0px;
    margin: 0px;
    font-family: "Source Sans Pro", sans-serif;
    background-color: var(--backgroundColor);
    line-height: normal;
  }
  #root {
    display: flex;
    align-items: center;
    flex-direction: column;
    color: var(--primaryTextColor);
    font-size: var(--body1);
  }
`;

/**
 * Styled component that creates global style
 * Variables can be accesed in other styled components
 * Styled components are automatically scoped to a local CSS class, therefore isolated from other components.
 * The limitation is removed here and things like CSS resets or base stylesheets can be applied.
 */

const defaultTheme = css`
  :root {
    // Colors
    --primaryBrandColor: #f2e8f9;
    --primaryBrandTintColor: #6b219f;
    --backgroundColor: #eaece9;
    --primaryTextColor: #000000;
    --secondaryTextColor: #3c3c43;
    --cardColor: #d5d9d3;
    --textFieldColor: #d1d1d6;
    --textFieldColorModal: #ebebff;
    --seperatorColor: #c6c6c8;
    --tintTextColor: white;
  }
`;

const darkTheme = css`
  :root {
    --primaryBrandColor: #6b219f;
    --primaryBrandTintColor: #f2e8f9;
    --backgroundColor: #1c1c1e;
    --primaryTextColor: #ffffff;
    --secondaryTextColor: #ebebf5;
    --cardColor: #2c2c2e;
    --textFieldColor: #3a3a3c;
    --seperatorColor: #38383a;
    --tintTextColor: black;
  }
`;

const systemTheme = css`
  ${defaultTheme}
  @media (prefers-color-scheme: dark) {
    ${darkTheme}
  }
`;
const GlobalStyle = createGlobalStyle`
  ${(props) => {
    if (props.theme == settingsEnum.light) return defaultTheme;
    else if (props.theme == settingsEnum.dark) return darkTheme;
    else return systemTheme;
  }}
  :root{
    // Font sizes
    --title1: 32px;
    --title2: 24px;
    --headline: 18px;
    --body1: 16px;
    --body2: 14px;
  }

  ${(props) => (props.popup ? Popup : Options)}

  path, circle {
    fill: var(--primaryTextColor);
  }
`;

export default GlobalStyle;
