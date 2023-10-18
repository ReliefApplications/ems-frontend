import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FormRecordsComponent } from './form-records.component';

export default {
  title: 'FormRecordsComponent',
  component: FormRecordsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<FormRecordsComponent>;

const Template: Story<FormRecordsComponent> = (args: FormRecordsComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
