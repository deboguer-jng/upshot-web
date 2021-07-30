import ThemeProvider, { globalstyles } from '../src/themes'

export const decorators = [
  (Story) => (
    /**
     * Wrap the stories with a styled-components theme provider.
     */
    <ThemeProvider>
      {globalstyles}
      <Story />
    </ThemeProvider>
  ),
]
