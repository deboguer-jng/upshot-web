module.exports = {
  stories: ['../src/components/**/*.stories.tsx'],
  features: {
    postcss: false, // We use styled-components instead.
  },
  core: {
    builder: 'webpack5',
  },
}
