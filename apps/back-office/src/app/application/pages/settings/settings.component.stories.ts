import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SettingsComponent } from './settings.component';

export default {
  title: 'SettingsComponent',
  component: SettingsComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<SettingsComponent>;

const Template: Story<SettingsComponent> = (args: SettingsComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
