import { globalStyles, theme } from '@upshot-tech/upshot-ui'
import { ThemeProvider } from '@emotion/react'

export const decorators = [
  (Story) => (
    /**
     * Wrap the stories with the UpshotUI theme provider.
     */
    <ThemeProvider {...{ theme }}>
      {globalStyles}
      <Story />
    </ThemeProvider>
  ),
]
