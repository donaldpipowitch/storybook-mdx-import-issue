const { getJestConfig } = require('@storybook/test-runner');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  // The default configuration comes from @storybook/test-runner
  ...getJestConfig(),
  /** Add your own overrides below
   * @see https://jestjs.io/docs/configuration
   */
  testEnvironmentOptions: {
    'jest-playwright': process.env.STORYBOOK_TEST_RUNNER_CI
      ? undefined
      : {
          connectOptions: {
            chromium: {
              wsEndpoint: 'ws://127.0.0.1:3000',
            },
          },
        },
  },
};
