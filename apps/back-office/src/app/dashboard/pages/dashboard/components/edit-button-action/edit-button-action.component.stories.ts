import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { EditButtonActionComponent } from './edit-button-action.component';

export default {
  title: 'EditButtonActionComponent',
  component: EditButtonActionComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<EditButtonActionComponent>;

const Template: Story<EditButtonActionComponent> = (
  args: EditButtonActionComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
