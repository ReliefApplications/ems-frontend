import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { IconComponent } from './icon.component';
import { variants } from '../types/variant';
import { IconModule } from './icon.module';

export default {
  title: 'Icon',
  component: IconComponent,
  argTypes: {
    variant: {
      options: variants,
      control: {
        type: 'select',
      },
    },
    size: {
      defaultValue: 24,
      control: 'number',
    },
    icon: {
      defaultValue: 'search_outline',
      control: { type: 'text' },
    },
  },
  decorators: [
    moduleMetadata({
      imports: [IconModule],
    }),
  ],
} as Meta<IconComponent>;

/**
 * Icon component template
 *
 * @param args Arguments for Icon Component
 * @returns IconComponent
 */
const Template: StoryFn<IconComponent> = (args: IconComponent) => ({
  props: args,
});

/**
 * Primary icon component
 */
export const Primary = Template.bind({});
Primary.args = {
  icon: 'search_outline',
  variant: 'default',
  size: 24,
};
