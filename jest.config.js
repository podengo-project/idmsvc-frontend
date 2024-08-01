const transformIgnorePatterns = ['node_modules/(?!(uuid)/)', '/node_modules/(?!@patternfly)/'];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', '!src/**/stories/*'],
  roots: ['<rootDir>/src/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns,
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
