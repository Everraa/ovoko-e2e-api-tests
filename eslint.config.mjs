import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    'node_modules/',
    'playwright-report/',
    'test-results/',
    'blob-report/',
    'playwright/.cache/',
  ]),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
);
