import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { RedirectComponent } from './redirect.component';

export default {
  title: 'RedirectComponent',
  component: RedirectComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<RedirectComponent>;

const Template: Story<RedirectComponent> = (args: RedirectComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
