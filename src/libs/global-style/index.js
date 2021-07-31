import { createGlobalStyle, css } from "styled-components"
import { getTheme, settingsEnum } from "../settings"

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

const tooltipStyles = css`
  .react-hint__content {
    padding: 10px;
    border-radius: 5px;
    background: var(--primaryBrandColor);
    text-align: center;
    width: max-content;
    max-width: 350px;
  }
  .react-hint--left:after {
    left: auto;
    border-right: none;
    border-left-color: var(--primaryBrandColor);
  }
  .react-hint--bottom:after {
    bottom: auto;
    border-top: none;
    border-bottom-color: var(--primaryBrandColor);
  }
  .react-hint--right:after {
    right: auto;
    border-left: none;
    border-right-color: var(--primaryBrandColor);
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
    --primaryBrandColor: #6b219f;
    --primaryBrandTintColor: #f2e8f9;
    --backgroundColor: #fcffff;
    --primaryTextColor: #000000;
    --secondaryTextColor: #3c3c43;
    --cardColor: #e0e0e0;
    --cardLoaderColor: #ebebeb;
    --textFieldColor: #f2e8f9;
    --inputTextFieldColor: #c6cdd2;
    --seperatorColor: #c6c6c8;
    --tintTextColor: white;
    --primaryHighlightColor: #6b219f;
  }
`

const darkTheme = css`
  :root {
    --primaryBrandColor: #6b219f;
    --primaryBrandTintColor: #f2e8f9;
    --backgroundColor: #1c1c1e;
    --primaryTextColor: #ffffff;
    --secondaryTextColor: #ebebf5;
    --cardColor: #2c2c2e;
    --cardLoaderColor: #323234;
    --textFieldColor: #3a3a3c;
    --inputTextFieldColor: #3a3a3c;
    --seperatorColor: #38383a;
    --tintTextColor: black;
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
  ${tooltipStyles}

  ${(props) => (props.popup ? Popup : Options)}

  path, circle {
    fill: var(--primaryTextColor);
  }
`

export default GlobalStyle
