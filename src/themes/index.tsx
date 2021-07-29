import React from 'react'
import { createGlobalStyle, css, ThemeProvider } from 'styled-components'
import { reset } from 'styled-reset'

import darkTheme from './dark'

interface Props {
  children: React.ReactNode
}

/**
 * Resets the box-model so that width and height are not affected
 * by border or padding.
 */
const resetBorderBox = css`
  html {
    box-sizing: border-box;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
`

/*
 * Application Flex Column
 * Provides a full-height flex-column base container.
 */
const appFlexColumn = css`
  html {
    height: 100%;
  }
  body {
    min-height: 100%;
  }
  body,
  #__next {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
`

/**
 * Global CSS for the application.
 */
export const GlobalStyle = createGlobalStyle`
  ${reset} /* @see https://meyerweb.com/eric/tools/css/reset/ */
  ${resetBorderBox}
  ${appFlexColumn}
`

export default function UpshotThemeProvider({ children }: Props) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
}
