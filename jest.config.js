module.exports = {
  // preset: "ts-jest",
  roots: ['<rootDir>/src'],
  transform: {
    '\\.(ts|tsx)?$': 'ts-jest',
    '\\.(js|jsx)?$': './utils/jestTransform.js',
  },
  // @trixt0r/ecs's compiled scripts uses ES6 modules & imports, which node doesn't recognize, must run them differently
  transformIgnorePatterns: ['node_modules/(?!(@trixt0r/ecs)/).+\\.js$'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // Want APIs like "requestAnimationFrame" to be true
    pretendToBeVisual: true,
  },
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  modulePaths: ['<rootDir>/src'],
  setupFiles: ['./utils/jestSetup.js', 'jest-webgl-canvas-mock'],
};
