import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AggregationsTabComponent } from './aggregations-tab.component';

export default {
  title: 'AggregationsTabComponent',
  component: AggregationsTabComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AggregationsTabComponent>;

const Template: Story<AggregationsTabComponent> = (
  args: AggregationsTabComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
