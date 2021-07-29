module.exports = {
  presets: ['next/babel'],
  /* Styled-components support */
  plugins: [
    ['styled-components', { ssr: true, displayName: true, preprocess: false }],
  ],
}
