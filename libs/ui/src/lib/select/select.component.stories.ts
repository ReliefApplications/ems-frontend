import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { SelectComponent } from './select.component';
import { StorybookTranslateModule } from '../../storybook-translate.module';
import { SelectModule } from './select.module';

export default {
  title: 'SelectComponent',
  component: SelectComponent,
  decorators: [
    moduleMetadata({
      imports: [SelectModule, StorybookTranslateModule],
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
