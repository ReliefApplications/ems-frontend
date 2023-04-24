module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-mdx-gfm'],
  staticDirs: [{
    from: '../../../assets',
    to: '/assets'
  }]
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
  ,

  docs: {
    autodocs: true
  },
  framework: {
    name: '@storybook/angular',
    options: {}
  }
};

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/packages/storybook/documents/custom-builder-configs