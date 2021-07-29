module.exports = {
  extends: ['next', 'next/core-web-vitals'],
  plugins: ['simple-import-sort'],
  rules: {
    /* Allow native <img /> elements. */
    '@next/next/no-img-element': 'off',
    /* Sort inputs & exports. */
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
}
