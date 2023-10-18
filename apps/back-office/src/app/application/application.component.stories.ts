import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ApplicationComponent } from './application.component';

export default {
  title: 'ApplicationComponent',
  component: ApplicationComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ApplicationComponent>;

const Template: Story<ApplicationComponent> = (args: ApplicationComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
