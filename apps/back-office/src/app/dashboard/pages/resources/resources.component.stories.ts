import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ResourcesComponent } from './resources.component';

export default {
  title: 'ResourcesComponent',
  component: ResourcesComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ResourcesComponent>;

const Template: Story<ResourcesComponent> = (args: ResourcesComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
