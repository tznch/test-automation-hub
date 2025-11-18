import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        JSX: 'readonly',
        RequestInit: 'readonly',
        React: 'readonly',
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': 'off', // Use TypeScript version instead
      'no-case-declarations': 'warn',
      'no-empty': 'warn',
    },
  },
  {
    ignores: ['**/dist/**', '**/build/**', '**/node_modules/**'],
  },
];
