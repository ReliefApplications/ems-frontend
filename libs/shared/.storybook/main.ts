import type { StorybookConfig } from '@storybook/angular';

/**
 * Storybook configuration
 */
const config: StorybookConfig = {
  stories: ['../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  staticDirs: [
    {
      from: '../../../assets',
      to: '/assets',
    },
    {
      from: '../src/i18n',
      to: '/assets/i18n',
    },
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
