import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { SelectComponent } from './select.component';
import { TranslateModule } from '@ngx-translate/core';

export default {
  title: 'SelectComponent',
  component: SelectComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslateModule],
    }),
  ],
} as Meta<SelectComponent>;

const Template: StoryFn<SelectComponent> = (args: SelectComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  label: '',
};
