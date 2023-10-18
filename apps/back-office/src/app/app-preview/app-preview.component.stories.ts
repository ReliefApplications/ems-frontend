import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AppPreviewComponent } from './app-preview.component';

export default {
  title: 'AppPreviewComponent',
  component: AppPreviewComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<AppPreviewComponent>;

const Template: Story<AppPreviewComponent> = (args: AppPreviewComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
