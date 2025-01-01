import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import * as tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: [
      '**/*.{js,jsx,ts,tsx,mjs,cjs}',
      'next-env.d.ts',
      '**/*.ts',
      '**/*.tsx',
      '.next/types/**/*.ts',
      '*.mjs',
      '*.config.mjs',
      '*.config.js',
      'next.config.ts',
      'app/**/*',
      'utils/**/*',
      'dbConfig/**/*',
      'helpers/**/*',
      'models/**/*',
      'types/**/*',
    ],
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/coverage/**',
      '**/.git/**',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: true,
        JSX: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@next/next': nextPlugin,
    },
    settings: {
      next: { rootDir: '.' },
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...nextPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
  prettier,
];
