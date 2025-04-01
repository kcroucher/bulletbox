import globals from 'globals';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin'
import parser from '@typescript-eslint/parser';

export default [
    eslint.configs.recommended,
    {
        files: ['src/*.ts'],
        languageOptions: {
            parser: parser,
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                ...globals.browser,
            }
        },
        plugins: {
            '@stylistic/ts': stylistic
        },
        rules: {
            '@stylistic/ts/indent': ['error', 4],
            '@stylistic/ts/semi': ['error', 'always']
        }
    },
]; 