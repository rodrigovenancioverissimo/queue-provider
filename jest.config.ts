/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/I[A-Z]*.[jt]s',
    '!src/**/factories/*.ts',
    '!src/**/*spec.ts',
    '!src/settings.ts',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/?(*.)+(spec.ts)'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
