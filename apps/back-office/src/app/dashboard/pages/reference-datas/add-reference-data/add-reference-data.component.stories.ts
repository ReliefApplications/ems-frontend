import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AddReferenceDataComponent } from './add-reference-data.component';

export default {
  title: 'AddReferenceDataComponent',
  component: AddReferenceDataComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AddReferenceDataComponent>;

const Template: Story<AddReferenceDataComponent> = (
  args: AddReferenceDataComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
