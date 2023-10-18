import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';

export default {
  title: 'CalculatedFieldsTabComponent',
  component: CalculatedFieldsTabComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<CalculatedFieldsTabComponent>;

const Template: Story<CalculatedFieldsTabComponent> = (
  args: CalculatedFieldsTabComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
