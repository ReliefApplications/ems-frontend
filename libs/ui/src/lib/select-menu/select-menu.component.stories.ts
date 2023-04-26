import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SelectMenuComponent } from './select-menu.component';

export default {
  title: 'SelectMenuComponent',
  component: SelectMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SelectMenuComponent>;

const Template: Story<SelectMenuComponent> = (args: SelectMenuComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
