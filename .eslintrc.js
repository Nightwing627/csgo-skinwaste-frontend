module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  globals: {
    CONFIG: true,
    APPVERSION: true
  },
  extends: [
    'eslint:recommended',
    '@vue/airbnb',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue']
      }
    }
  },
  rules: {
    // preference overrides
    'comma-dangle': [1, 'never'],
    semi: [2, 'never'],
    'max-len': [1, {
      code: 120,
      tabWidth: 2
    }],
    'linebreak-style': 0,

    //
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': 'off',
    'global-require': 'off',
    'no-bitwise': 'off',
    'import/extensions': 0,
    'arrow-parens': [2, 'as-needed'],

    // VUE RELATED
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'acc', // for reduce accumulators
          'e', // for e.returnvalue
          'state' // for vuex state setting
        ]
      }
    ],
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: true,
        ignores: ['fai'] // Font Awesome 5 Vue Component
      }
    ],
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 4,
        multiline: {
          max: 4,
          allowFirstLine: false
        }
      }
    ]
  }
}
