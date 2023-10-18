import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ReferenceDataComponent } from './reference-data.component';

export default {
  title: 'ReferenceDataComponent',
  component: ReferenceDataComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ReferenceDataComponent>;

const Template: Story<ReferenceDataComponent> = (
  args: ReferenceDataComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
