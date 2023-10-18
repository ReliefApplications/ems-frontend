import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ApiConfigurationComponent } from './api-configuration.component';

export default {
  title: 'ApiConfigurationComponent',
  component: ApiConfigurationComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ApiConfigurationComponent>;

const Template: Story<ApiConfigurationComponent> = (
  args: ApiConfigurationComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
