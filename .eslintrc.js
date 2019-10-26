module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'eol-last': 0,
    'no-console': 0,
    'linebreak-style': 0,
    'comma-dangle': 0,
    'no-undef': 0,
    'func-names': 0,
    'prefer-destructuring': 0,
    'no-alert': 0
  },
};