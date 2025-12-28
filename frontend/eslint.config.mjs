// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    // 1. Ignorar pastas geradas pelo React Router v7 e builds
    ignores: [
      'eslint.config.mjs',
      'dist/',
      '.react-router/',
      'build/',
      'node_modules/',
      'public/',
    ],
  },
  // 2. Base de regras recomendadas (JS e TS com verificação de tipos)
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // 3. Integração com Prettier (deve vir antes das regras customizadas)
  eslintPluginPrettierRecommended,

  {
    // 4. Configuração para arquivos React
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Regras de Hooks (essencial para o modelo de dados do React Router v7)
      ...reactHooks.configs.recommended.rules,

      // Regras de React
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,

      // Customizações de TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Desativa regras que o TypeScript já resolve
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // 5. Sincronização final com o seu .prettierrc
      'prettier/prettier': [
        'error',
        {
          // Força o ESLint a ler as quebras de linha do seu .prettierrc
          endOfLine: 'auto',
        },
      ],
    },
  },
);
