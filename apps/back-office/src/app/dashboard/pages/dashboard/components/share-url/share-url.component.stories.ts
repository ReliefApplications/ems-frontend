import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ShareUrlComponent } from './share-url.component';

export default {
  title: 'ShareUrlComponent',
  component: ShareUrlComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<ShareUrlComponent>;

const Template: Story<ShareUrlComponent> = (args: ShareUrlComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
