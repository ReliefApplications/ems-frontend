import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UploadMenuComponent } from './upload-menu.component';

export default {
  title: 'UploadMenuComponent',
  component: UploadMenuComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<UploadMenuComponent>;

const Template: Story<UploadMenuComponent> = (args: UploadMenuComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
