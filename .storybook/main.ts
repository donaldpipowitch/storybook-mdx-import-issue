import path from 'path';
import { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    // The first Story defines the default page that is shown when Storybook opens
    '../stories/root/0-introduction.mdx',
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        docs: false, // Disable the docs addon since we use custom mdx plugin options
      },
    },
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/test-runner',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: { strictMode: true },
  },
  typescript: {
    // only run docgen during build
    reactDocgen: process.env.STORYBOOK_CI ? 'react-docgen-typescript' : false,
  },
  docs: {
    autodocs: true,
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      stories: path.resolve(__dirname, '../stories'),
      '.storybook': path.resolve(__dirname),
    };

    if (process.env.STORYBOOK_NOT_MINIFIED === 'true') {
      config.build = config.build ?? {};
      config.build.minify = false;
    }

    config.plugins = config.plugins ?? [];
    config.plugins.push({
      name: 'manual-cache',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // avoid flashing content
          const exts = [
            '.png',
            '.jpg',
            '.gif',
            '.svg',
            '.ico',
            '.css',
            '.eot',
            '.woff',
            '.woff2',
            '.ttf',
          ];
          const [url] = req.url?.split('?') ?? [];
          if (exts.some((ext) => url?.endsWith(ext))) {
            res.setHeader('Cache-Control', 'public, max-age=60'); // in seconds
          }
          next();
        });
      },
    });

    config.server = config.server ?? {};
    config.server.watch = config.server.watch ?? {};
    config.server.watch.ignored = [
      '**/angular/**',
      '**/cdk/**',
      '**/vendor/**',
      '**/storybook/**',
      '**/.storybook-images/**',
      '**/.pnpm-store/**',
      '**/.cy-cache/**',
    ];

    return config;
  },
};

export default config;
