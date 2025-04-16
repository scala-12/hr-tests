module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  detectOpenHandles: true,
  forceExit: true,
  verbose: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
