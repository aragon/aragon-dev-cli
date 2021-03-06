/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'babel',

  // The test environment that will be used for testing
  testEnvironment: 'node',

  // Jest Runner
  runner: 'jest-serial-runner',

  // Global Teardown Config
  globalTeardown: '../../scripts/teardown-logic.js',

  // Verbose mode
  verbose: true,
}
