/*
Licensed per https://github.com/privacy-tech-lab/privacy-pioneer/blob/main/LICENSE
privacy-tech-lab, https://www.privacytechlab.org/
*/

import { createGlobalStyle, css } from "styled-components"
import { settingsEnum } from "../indexed-db/settings"

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
`

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
`

/**
 * Styled component that creates global style
 * Variables can be accesed in other styled components
 * Styled components are automatically scoped to a local CSS class, therefore isolated from other components.
 * The limitation is removed here and things like CSS resets or base stylesheets can be applied.
 */

const defaultTheme = css`
  :root {
    // Colors
    --primaryBrandColor: #9b45d9;
    --primaryBrandTintColor: #f2e8f9;
    --backgroundColor: #fcffff;
    --primaryTextColor: #000000;
    --secondaryTextColor: #3c3c43;
    --cardColor: #e0e0e0;
    --cardLoaderColor: #ebebeb;
    --textFieldColor: #f2e8f9;
    --inputTextFieldColor: #c6cdd2;
    --seperatorColor: #c6c6c8;
    --tintTextColor: #f2e8f9;
    --primaryHighlightColor: #6b219f;
  }
`

const darkTheme = css`
  :root {
    --backgroundColor: #1c1c1e;
    --primaryTextColor: #ffffff;
    --secondaryTextColor: #ebebf5;
    --cardColor: #2c2c2e;
    --cardLoaderColor: #323234;
    --textFieldColor: #3a3a3c;
    --inputTextFieldColor: #3a3a3c;
    --seperatorColor: #38383a;
    --tintTextColor: #6b219f;
    --primaryHighlightColor: #f2e8f9;
  }
`

const systemTheme = css`
  ${defaultTheme}
  @media (prefers-color-scheme: dark) {
    ${darkTheme}
  }
`
const GlobalStyle = createGlobalStyle`
  ${(props) => {
    if (props.theme == settingsEnum.light) return defaultTheme
    else if (props.theme == settingsEnum.dark) return darkTheme
    else return systemTheme
  }}
  :root{
    // Font sizes
    --title1: 32px;
    --title2: 24px;
    --headline: 18px;
    --body1: 16px;
    --body2: 14px;
  }
  .reactTooltip{
    z-index: 10000 !important;
    opacity: 1 !important;
    max-width: 250px !important;
    text-align: center;
    font-weight:600;
  }

  ${(props) => (props.popup ? Popup : Options)}

  path, circle {
    fill: var(--primaryTextColor);
  }
`

export default GlobalStyle
