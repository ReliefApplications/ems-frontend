import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormsTabComponent } from './forms-tab.component';

export default {
  title: 'FormsTabComponent',
  component: FormsTabComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<FormsTabComponent>;

const Template: Story<FormsTabComponent> = (args: FormsTabComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
