import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { IconComponent } from './icon.component';
import { IconVariant } from './enums/icon-variant.enum';
import { IconModule } from './icon.module';

export default {
  title: 'IconComponent',
  component: IconComponent,
  decorators: [
    moduleMetadata({
      imports: [IconModule],
    }),
  ],
} as Meta<IconComponent>;

const Template: StoryFn<IconComponent> = (args: IconComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  icon: 'search_outline',
  inline: false,
  variant: IconVariant.DEFAULT,
  size: 24,
};
