import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AddApiConfigurationComponent } from './add-api-configuration.component';

export default {
  title: 'AddApiConfigurationComponent',
  component: AddApiConfigurationComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AddApiConfigurationComponent>;

const Template: Story<AddApiConfigurationComponent> = (
  args: AddApiConfigurationComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
