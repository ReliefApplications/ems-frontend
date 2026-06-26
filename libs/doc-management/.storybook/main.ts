import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import type { StorybookConfig } from '@storybook/angular';

/**
 * Storybook configuration
 */
const config: StorybookConfig = {
  stories: ['../**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [getAbsolutePath("@storybook/addon-docs")],
  staticDirs: [
    {
      from: '../../../assets',
      to: '/assets',
    },
    {
      from: '../../shared/src/i18n',
      to: '/assets/i18n',
    },
  ],
  framework: {
    name: getAbsolutePath("@storybook/angular"),
    options: {},
  },
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
