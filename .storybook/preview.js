import { globalStyles, theme } from '@upshot-tech/upshot-ui'
import { ThemeProvider } from '@emotion/react'
import '@upshot-tech/upshot-ui/dist/css/typekit.css'

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
