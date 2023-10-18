import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ApiConfigurationsComponent } from './api-configurations.component';

export default {
  title: 'ApiConfigurationsComponent',
  component: ApiConfigurationsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ApiConfigurationsComponent>;

const Template: Story<ApiConfigurationsComponent> = (
  args: ApiConfigurationsComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
