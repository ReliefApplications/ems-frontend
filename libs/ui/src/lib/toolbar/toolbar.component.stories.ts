import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ToolbarComponent } from './toolbar.component';

export default {
  title: 'ToolbarComponent',
  component: ToolbarComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ToolbarComponent>;

const Template: Story<ToolbarComponent> = (args: ToolbarComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
