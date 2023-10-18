import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ApplicationsComponent } from './applications.component';

export default {
  title: 'ApplicationsComponent',
  component: ApplicationsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ApplicationsComponent>;

const Template: Story<ApplicationsComponent> = (
  args: ApplicationsComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
