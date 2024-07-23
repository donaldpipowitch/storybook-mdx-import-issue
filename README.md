Example to show an issue with absolute paths in MDX files.

```bash
$ pnpm install
$ pnpm storybook
# Open http://localhost:58413/?path=/docs/patterns-interactions-cards--docs and you see an issue.
```

How to fix? Go to `stories/patterns/interactions/1-cards.mdx` and change the import to relative path:

```diff
- import * as Stories from "stories/patterns/interactions/example.stories"
+ import * as Stories from "./example.stories"
```

Besides having this bug in the first place the test runner doesn't report it:

```bash
$ pnpm exec playwright install
$ STORYBOOK_TEST_RUNNER_CI=test pnpm test-storybook:build-and-run
```

Looks like there is only a test generated for `stories/patterns/interactions/example.stories.tsx`, but not `stories/patterns/interactions/1-cards.mdx`? Maybe a configuration issue on my side?

If the test runner config looks a bit tricky, I once broke it down [here](https://gist.github.com/donaldpipowitch/605088fca125845aa0c4ecbeeb21a0f0#intro).
