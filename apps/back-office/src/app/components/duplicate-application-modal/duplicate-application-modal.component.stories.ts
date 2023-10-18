import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DuplicateApplicationModalComponent } from './duplicate-application-modal.component';

export default {
  title: 'DuplicateApplicationModalComponent',
  component: DuplicateApplicationModalComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<DuplicateApplicationModalComponent>;

const Template: Story<DuplicateApplicationModalComponent> = (
  args: DuplicateApplicationModalComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
