import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { HistoryComponent } from './history.component';

export default {
  title: 'HistoryComponent',
  component: HistoryComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<HistoryComponent>;

const Template: Story<HistoryComponent> = (args: HistoryComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  dataSource: [],
};
