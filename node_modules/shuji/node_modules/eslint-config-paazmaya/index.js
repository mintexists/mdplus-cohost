/**
 * eslint-config-paazmaya
 * https://github.com/paazmaya/eslint-config-paazmaya
 *
 * Shared ESLint configuration between my projects since it is possible
 *
 * Copyright (c) Juga Paazmaya <paazmaya@yahoo.com> (https://paazmaya.fi)
 * Licensed under the MIT license
 */

module.exports = {
  rules: {

    // 7.18, no new rules
    // 7.17, no new rules
    // 7.16, no new rules

    // 7.15
    'no-unsafe-optional-chaining': 'warn',

    // 7.14
    'no-nonoctal-decimal-escape': 'error',

    // 7.13, no new rules
    // 7.12, no new rules
    // 7.11, no new rules
    // 7.10, no new rules
    // 7.9, no new rules
    // 7.8, Support for logical assignment operators and numeric separators, no new rules
    // 7.7, no new rules
    // 7.6, no new rules
    // 7.5, Optional Chaining Support, no new rules
    // 7.4, no new rules

    // 7.3
    'no-promise-executor-return': 'error',
    'no-unreachable-loop': 'error',

    // 7.2, ECMAScript 2020 syntax support, no new rules

    // 7.1
    'no-loss-of-precision': 'error',

    // 7.0
    'default-case-last': 'off',
    'no-useless-backreference': 'off',
    'no-restricted-exports': 'off',

    // 6.8, no new rules

    // 6.7
    'grouped-accessor-pairs': 'error',
    'no-constructor-return': 'error',
    'no-dupe-else-if': 'error',
    'no-setter-return': 'error',
    'prefer-exponentiation-operator': 'warn',

    // 6.6, no new rules
    // 6.5, no new rules

    // 6.4
    'no-import-assign': 'error',
    'prefer-regex-literals': 'warn',
    'default-param-last': 'error',

    // 6.3, no new rules

    // 6.2
    'function-call-argument-newline': 'off',

    // 6.1, no new rules
    // 6.0, no new rules
    // 5.16, no new rules

    // 5.15
    'prefer-named-capture-group': 'off', // Requires support for ECMAScript 2018

    // 5.14, no new rules
    // 5.13, no new rules
    // 5.12, no new rules

    // 5.11
    'no-useless-catch': 'warn',

    // 5.10, no new rules
    // 5.9, no new rules
    // 5.8, no new rules
    // 5.7, no new rules
    // 5.6, no new rules
    // 5.5, no new rules
    // 5.4, no new rules

    // 5.3
    'no-misleading-character-class': 'warn',
    'require-atomic-updates': 'error',
    'no-async-promise-executor': 'error',
    'require-unicode-regexp': 'error',

    // 5.2, no new rules
    // 5.1, no new rules

    // 5.0
    'prefer-object-spread': 'off',
    'max-classes-per-file': ['error', 1],
    'max-lines-per-function': [
      'warn', {
        max: 22,
        skipBlankLines: true
      }
    ],

    // 4.19, no new rules
    // 4.18, no new rules
    // 4.17, no new rules
    // 4.16, no new rules
    // 4.15, no new rules
    // 4.14, no new rules
    // 4.13, no new rules

    // 4.12
    'implicit-arrow-linebreak': 'off',

    // 4.11, no new rules
    // 4.10, no new rules

    // 4.9
    'multiline-comment-style': 'off',
    'lines-between-class-members': [
      'error', 'always', {
        exceptAfterSingleLine: true
      }
    ],

    // 4.8, no new rules
    // 4.7, no new rules

    // 4.6
    'function-paren-newline': 'off',

    // 4.5, no new rules
    // 4.4, no new rules
    // 4.3, no new rules

    // 4.2
    'getter-return': 'error',

    // 4.1, no new rules

    // 4.0
    'array-element-newline': 'off',
    'semi-style': ['error', 'last'],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: 'directive',
        next: '*'
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'return'
      }
    ],
    'for-direction': 'error',
    'switch-colon-spacing': [
      'error', {
        after: true,
        before: false
      }
    ],
    'array-bracket-newline': [
      'warn', {
        multiline: true
      }
    ],
    'no-buffer-constructor': 'error',

    // 3.19, no new rules

    // 3.18, no new rules

    // 3.17
    'no-compare-neg-zero': 'error',
    'nonblock-statement-body-position': 'off', // Already using curly: error.

    // 3.16, no new rules

    // 3.15
    'template-tag-spacing': ['error', 'never'],

    // 3.14
    'no-multi-assign': 'warn',
    'prefer-promise-reject-errors': [
      'error', {
        allowEmptyReject: true
      }
    ],

    // 3.13
    'prefer-destructuring': 'warn',

    // 3.12
    'no-await-in-loop': 'error',

    // 3.11
    'capitalized-comments': 'off',
    'require-await': 'error',

    // 3.10
    'no-return-await': 'error',

    // 3.9
    'no-useless-return': 'error',

    // 3.8
    'func-name-matching': 'warn',

    // 3.7, no new rules
    // 3.6, no new rules

    // 3.5
    'prefer-numeric-literals': 'error',
    'no-restricted-properties': 'off',
    'line-comment-position': 'off',

    // 3.4
    'symbol-description': 'off',
    'class-methods-use-this': 'warn',

    // 3.3
    'sort-keys': 'off',
    'no-template-curly-in-string': 'warn',

    // 3.2
    'no-tabs': 'error',

    // 3.1
    'multiline-ternary': ['error', 'always'],

    // 2.12
    'max-lines': [
      'warn', {
        max: 200,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    'object-curly-newline': [
      'error', {
        minProperties: 1
      }
    ],

    // 2.11
    'no-useless-rename': [
      'error', {
        ignoreDestructuring: false,
        ignoreImport: false,
        ignoreExport: false
      }
    ],
    'unicode-bom': ['error', 'never'],
    'no-prototype-builtins': 'error',

    // 2.10
    'object-property-newline': 'error',

    // 2.9
    'no-unsafe-finally': 'error',
    'no-useless-computed-key': 'error',

    // 2.5
    'no-useless-escape': 'error',
    'max-statements-per-line': [
      'error', {
        max: 1
      }
    ],
    'no-duplicate-imports': 'error',

    // 2.3
    'no-restricted-globals': 'off',


    'arrow-parens': 'error',
    'array-bracket-spacing': 'error',
    'block-scoped-var': 'off',
    'brace-style': ['error', 'stroustrup'],
    camelcase: 'off',
    'comma-dangle': 'error',
    'comma-spacing': [
      'error', {
        before: false,
        after: true
      }
    ],
    'comma-style': ['error', 'last'],
    complexity: ['warn', 12],
    'computed-property-spacing': ['error', 'never'],
    'consistent-return': 'error',
    'consistent-this': ['error', '_self'],
    curly: 'error',
    'default-case': 'error',
    'dot-notation': 'warn',
    'eol-last': 'warn',
    eqeqeq: 'error',
    'func-names': 'warn',
    'func-style': ['error', 'expression'],
    'guard-for-in': 'warn',
    'handle-callback-err': 'error',
    indent: ['error', 2],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'max-depth': [1, 4],
    'max-len': [1, 120, 4],
    'max-nested-callbacks': [1, 2],
    'max-params': [1, 3],
    'max-statements': [1, 10],
    'new-cap': 'error',
    'new-parens': 'error',
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-bitwise': 'off',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'off',
    'no-constant-condition': 'error',
    'no-control-regex': 'error',
    'no-debugger': 'error',
    'no-delete-var': 'error',
    'no-div-regex': 'off',
    'no-dupe-keys': 'error',
    'no-else-return': 'off',
    'no-empty': 'error',
    'no-empty-character-class': 'error',
    'no-eq-null': 'off',
    'no-eval': 'error',
    'no-ex-assign': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-extra-boolean-cast': 'error',
    'no-extra-parens': 'error',
    'no-extra-semi': 'error',
    'no-fallthrough': 'error',
    'no-floating-decimal': 'off',
    'no-func-assign': 'error',
    'no-implied-eval': 'error',
    'no-inline-comments': 'off',
    'no-inner-declarations': 'error',
    'no-invalid-regexp': 'error',
    'no-iterator': 'error',
    'no-label-var': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-mixed-requires': [1, true],
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': 'error',
    'no-global-assign': 'error',
    'no-unsafe-negation': 'error',
    'no-nested-ternary': 'warn',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-obj-calls': 'error',
    'no-octal': 'error',
    'no-octal-escape': 'error',
    'no-path-concat': 'error',
    'no-plusplus': 'off',
    'no-process-env': 'warn',
    'no-process-exit': 'warn',
    'no-proto': 'error',
    'no-redeclare': 'error',
    'no-regex-spaces': 'error',
    'no-restricted-modules': 'off',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'off',
    'no-sequences': 'error',
    'no-shadow': 'error',
    'no-shadow-restricted-names': 'error',
    'func-call-spacing': 'warn',
    'no-sparse-arrays': 'error',
    'no-sync': 'off',
    'no-ternary': 'off',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-undef-init': 'error',
    'no-undefined': 'warn',
    'no-underscore-dangle': 'off',
    'no-unreachable': 'error',
    'no-unused-expressions': 'warn',
    'no-unused-vars': ['error', 'local'],
    'no-use-before-define': 'warn',

    // Shall not use var since ES6 has let and const, but few browser projects might need it
    'no-var': 'warn',

    'no-void': 'error',

    // Sometimes need to have FIXME or TODO
    'no-warning-comments': 'warn',

    'no-with': 'error',
    'object-curly-spacing': ['error', 'never'],
    'one-var': 'off',
    'operator-assignment': ['error', 'always'],
    'prefer-const': 'error',
    'quote-props': ['warn', 'as-needed'],
    quotes: ['error', 'single'],
    radix: 'error',
    semi: 'error',
    'semi-spacing': [
      'error', {
        before: false,
        after: true
      }
    ],
    'sort-vars': 'off',
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': 'warn',
    'spaced-comment': ['off', 'always'],
    strict: 'off',
    'use-isnan': 'error',
    'valid-typeof': 'error',
    'vars-on-top': 'off',
    'wrap-iife': ['error', 'inside'],
    'wrap-regex': 'off',
    yoda: ['error', 'never']
  },
  env: {
    node: true,
    es6: true
  },

  // 6.3
  reportUnusedDisableDirectives: true
};
