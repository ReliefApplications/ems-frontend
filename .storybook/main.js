module.exports = {
  "stories": ["../stories/**/*.stories.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)", '../projects/**/*.stories.ts'],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-knobs"],
  core: {
    builder: "webpack5"
  }
};