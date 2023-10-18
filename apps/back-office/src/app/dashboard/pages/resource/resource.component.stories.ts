import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ResourceComponent } from './resource.component';

export default {
  title: 'ResourceComponent',
  component: ResourceComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ResourceComponent>;

const Template: Story<ResourceComponent> = (args: ResourceComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
