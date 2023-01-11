module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/linebreak-style': 0,
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 0,

    'padding-line-between-statements': [                                      // quy tắc cách 1 dòng
      1,
      { blankLine: 'always', prev: '*', next: ['class', 'function', 'export'] },
      { blankLine: 'always', prev: ['import'], next: '*' },
      { blankLine: 'never', prev: ['import'], next: ['import'] },
      { blankLine: 'any', prev: ['export'], next: ['export'] },
    ],
  },
}
