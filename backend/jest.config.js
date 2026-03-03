'use strict';

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageThreshold: {
    global: {
      lines: 60,
      functions: 60,
    },
  },
  setupFiles: ['./test/setup.js'],
  testTimeout: 15000,
};
