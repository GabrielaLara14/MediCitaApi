// Configuración de ESLint: reglas que revisan el estilo y detectan errores comunes en el código.
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  // No revisar las dependencias instaladas.
  { ignores: ['node_modules/'] },
  // Reglas recomendadas por ESLint como base.
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      // El proyecto usa require/module.exports (CommonJS) y variables globales de Node.
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      // Marca como error las variables sin usar, salvo parámetros que empiezan por "_".
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Marca como error el uso de variables no declaradas.
      'no-undef': 'error',
    },
  },
  {
    // Los scripts de la carpeta public corren en el navegador, no en Node.
    files: ['public/**/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.browser },
  },
];
