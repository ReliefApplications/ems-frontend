import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PreviewToolbarComponent } from './preview-toolbar.component';

export default {
  title: 'PreviewToolbarComponent',
  component: PreviewToolbarComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<PreviewToolbarComponent>;

const Template: Story<PreviewToolbarComponent> = (
  args: PreviewToolbarComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
