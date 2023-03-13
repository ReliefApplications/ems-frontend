const path = require('path');

module.exports = {
  core: { builder: 'webpack5' },
  // stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  stories: [
    '../**/*.stories.mdx',
    '../src/lib/components/ui/button/button.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/breadcrumb/breadcrumb.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/badge/badge.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/avatar/avatar.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/divider/divider.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/empty/empty.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/icon/icon.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/line-chart/line-chart.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/pie-donut-chart/pie-donut-chart.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/spinner/spinner.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/tagbox/tagbox.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/aggregation-builder/pipeline/group-stage/group-stage.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/aggregation-builder/pipeline/expressions/expressions.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/ui/aggregation-builder/series-mapping/series-mapping.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/mapping/mapping.stories.@(js|jsx|ts|tsx)',
    '../src/lib/components/mapping/mapping-modal/mapping-modal.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials'],
  // webpackFinal: async (config, { configType }) => {
  //   // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  //   // You can change the configuration based on that.
  //   // 'PRODUCTION' is used when building the static version of storybook.

  //   // Make whatever fine-grained changes you need
  //   config.module.rules.push({
  //     test: /\.m?js$/,
  //     resolve: {
  //       fullySpecified: false,
  //     },
  //   });

  //   config.resolve.alias['variables.scss'] = path.resolve(__dirname, '../stories/variables.scss');
  //   // Return the altered config
  //   return config;
  // },
};

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs
