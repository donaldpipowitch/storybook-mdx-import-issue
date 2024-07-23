const { getStoryContext } = require('@storybook/test-runner');
const { toMatchImageSnapshot } = require('jest-image-snapshot');

module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  // https://github.com/storybookjs/test-runner#prepare
  // https://github.com/storybookjs/test-runner/blob/next/src/setup-page.ts#L12
  async prepare({ page, browserContext, testRunnerConfig }) {
    // this line is customized!
    const targetURL = process.env.STORYBOOK_TEST_RUNNER_CI
      ? 'http://127.0.0.1:58414'
      : process.env.STORYBOOK_TEST_RUNNER_HOST_IP
        ? `http://${process.env.STORYBOOK_TEST_RUNNER_HOST_IP}:58414`
        : 'http://host.docker.internal:58414';
    const iframeURL = new URL('iframe.html', targetURL).toString();

    if (testRunnerConfig?.getHttpHeaders) {
      const headers = await testRunnerConfig.getHttpHeaders(iframeURL);
      await browserContext.setExtraHTTPHeaders(headers);
    }

    await page.goto(iframeURL, { waitUntil: 'load' }).catch((err) => {
      if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
        const errorMessage = `Could not access the Storybook instance at ${targetURL}. Are you sure it's running?\n\n${err.message}`;
        throw new Error(errorMessage);
      }

      throw err;
    });
  },
  // context = { id, title, name }
  async postVisit(page, context) {
    if (!context.title.includes('Components/')) return;

    // storyContext.parameters gives you access to the parameters defined in the story and more
    // supported API:
    // {
    //   image: {
    //     waitTime?: number; // in ms: wait that long before taking the screenshot
    //     skip?: boolean; // do NOT take a screenshot
    //     snapshotOptions?: MatchImageSnapshotOptions; // override our default options (https://github.com/americanexpress/jest-image-snapshot#%EF%B8%8F-api)
    //     triggerLayoutChange?: boolean; // by default we trigger a layout change to stabilize some screenshots, but this can be a problem in some edge cases - disallow it, if you see for example too much space at the bottom of your screenshots
    //   }
    // }
    const storyContext = await getStoryContext(page, context);
    const imageParameters = storyContext.parameters.image || {};

    if (imageParameters.skip) return;

    // Make sure assets (images, fonts) are loaded and ready
    // - first let the page load
    // - then add some optional wait time (e.g. to lazy load more parts of the page)
    // - then wait for all assets to be loaded
    await page.waitForLoadState('domcontentloaded');
    if (imageParameters.waitTime)
      await new Promise((resolve) =>
        setTimeout(resolve, imageParameters.waitTime)
      );
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => {
      const images = Array.from(document.querySelectorAll('img'));
      return images.every((img) => img.complete);
    });

    // changing the viewport size triggers a layout recalculation which might be necessary for some components
    // to avoid flaky results (looking at you, floating UI!)
    if (imageParameters.triggerLayoutChange ?? true) {
      await page.setViewportSize({ width: 640, height: 480 });
      await page.setViewportSize({ width: 1280, height: 720 });
    }

    const image = await page.screenshot({
      animations: 'disabled',
      fullPage: true,
    });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: '.storybook-images',
      customSnapshotIdentifier: context.id,
      storeReceivedOnFailure: true, // sadly this currently doesn't work for new images: https://github.com/americanexpress/jest-image-snapshot/issues/331
      ...imageParameters.snapshotOptions,
    });
  },
};
