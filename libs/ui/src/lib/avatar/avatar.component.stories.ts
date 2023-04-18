import { moduleMetadata, StoryFn, Meta } from '@storybook/angular';
import { AvatarComponent } from './avatar.component';
import { Size } from '../shared/size.enum';
import { AvatarModule } from './avatar.module';

export default {
  title: 'AvatarComponent',
  component: AvatarComponent,
  decorators: [
    moduleMetadata({
      imports: [AvatarModule],
    }),
  ],
} as Meta<AvatarComponent>;

const Template: StoryFn<AvatarComponent> = (args: AvatarComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  size: Size.MEDIUM,
  icon: '',
  action: () => {
    console.log('Action triggered!');
  },
};
