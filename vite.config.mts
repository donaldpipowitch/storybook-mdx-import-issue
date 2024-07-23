import { resolve } from 'path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, PluginOption } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isCiBuild = process.env.CI_BUILD === 'true';

  const plugins: PluginOption[] = [react()];

  return {
    base: process.env.VITE_BASE_PATH,
    plugins,
    resolve: {
      alias: {
        src: resolve(__dirname, 'src'),
      },
    },
    build: {
      sourcemap: true,
    },
    server: {
      port: 4200,
      host: true, // needed for port forwarding in intellij devcontainers
      proxy: {
        '/angular': 'http://127.0.0.1:7070',
      },
      watch: {
        ignored: ['**/storybook/**'],
      },
    },
  };
});
