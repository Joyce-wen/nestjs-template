import antfu from '@antfu/eslint-config';
import globals from 'globals';

export default antfu({
  typescript: true,
  stylistic: { semi: true, quotes: 'single', indent: 2 },
  formatters: true,
  ignores: ['dist', 'node_modules', 'public'],
  rules: {
    'node/prefer-global/process': 'off',
    'style/comma-dangle': ['error', 'always-multiline'],
    'style/object-curly-spacing': ['error', 'always'],
    'style/jsx-quotes': ['error', 'prefer-single'],
    'no-console': 'warn',
    'ts/no-explicit-any': 'off',
    'ts/no-floating-promises': 'warn',
    'ts/no-unsafe-argument': 'warn',
    'ts/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrors: 'none',
        destructuredArrayIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
  },
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
    ecmaVersion: 5,
    sourceType: 'module',
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
