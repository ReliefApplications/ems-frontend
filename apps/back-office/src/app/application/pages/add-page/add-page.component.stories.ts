import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AddPageComponent } from './add-page.component';

export default {
  title: 'AddPageComponent',
  component: AddPageComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AddPageComponent>;

const Template: Story<AddPageComponent> = (args: AddPageComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
