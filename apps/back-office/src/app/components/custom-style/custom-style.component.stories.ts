import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CustomStyleComponent } from './custom-style.component';

export default {
  title: 'CustomStyleComponent',
  component: CustomStyleComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<CustomStyleComponent>;

const Template: Story<CustomStyleComponent> = (args: CustomStyleComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
