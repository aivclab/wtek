module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'standard'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },

  globals: {
    window: true,
    module: true,
    GPUShaderStage: true,
    GPUTextureUsage: true,
    GPUBufferUsage: true,
    GPUMapMode: true
  },
  rules: {
    'no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false }
    ],
    'no-empty': ['warn', {}],
    'no-undef': ['warn', {}],
    'no-useless-constructor': ['warn']
  }
}
