import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { CheckboxComponent } from './checkbox.component';
import { TranslateModule } from '@ngx-translate/core';

export default {
  title: 'CheckboxComponent',
  component: CheckboxComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslateModule],
    }),
  ],
} as Meta<CheckboxComponent>;

const Template: StoryFn<CheckboxComponent> = (args: CheckboxComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  checked: false,
  indeterminate: false,
  id: '',
  name: '',
  label: '',
  ariaLabel: '',
  description: '',
};
