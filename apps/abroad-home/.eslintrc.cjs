/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: '@antfu',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'multiline-ternary': 'off',
    'antfu/if-newline': 'off',
    'arrow-parens': 'off',
    'operator-linebreak': 'off',
    'no-console': 'warn',
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
  },
}
