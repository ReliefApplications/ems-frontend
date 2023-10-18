import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { LayoutsTabComponent } from './layouts-tab.component';

export default {
  title: 'LayoutsTabComponent',
  component: LayoutsTabComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<LayoutsTabComponent>;

const Template: Story<LayoutsTabComponent> = (args: LayoutsTabComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
