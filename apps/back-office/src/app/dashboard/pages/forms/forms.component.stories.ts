import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormsComponent } from './forms.component';

export default {
  title: 'FormsComponent',
  component: FormsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<FormsComponent>;

const Template: Story<FormsComponent> = (args: FormsComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
