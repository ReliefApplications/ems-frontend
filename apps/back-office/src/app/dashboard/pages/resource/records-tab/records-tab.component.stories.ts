import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { RecordsTabComponent } from './records-tab.component';

export default {
  title: 'RecordsTabComponent',
  component: RecordsTabComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<RecordsTabComponent>;

const Template: Story<RecordsTabComponent> = (args: RecordsTabComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
