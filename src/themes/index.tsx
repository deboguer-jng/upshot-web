import React from 'react'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

import darkTheme from './dark'
interface Props {
  children: React.ReactNode
}

/**
 * Global CSS for the application.
 */
export const GlobalStyle = createGlobalStyle`
`

export default function UpshotThemeProvider({ children }: Props) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
}
