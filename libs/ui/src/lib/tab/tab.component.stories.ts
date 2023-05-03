import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TabComponent } from './tab.component';

export default {
  title: 'Tab',
  component: TabComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<TabComponent>;

const Template: Story<TabComponent> = (args: TabComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
