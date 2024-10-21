import js from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': ['warn', 2],
      '@stylistic/js/linebreak-style': ['warn', 'unix'],
      '@stylistic/js/quotes': ['warn', 'single'],
      '@stylistic/js/semi': ['warn', 'never'],
      'eqeqeq': 'warn',
      'no-trailing-spaces': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'arrow-spacing': ['warn', { 'before': true, 'after': true },],
      'no-console': 'off',
    },
  },
  { ignores: ["dist/**", "build/**"], },
]