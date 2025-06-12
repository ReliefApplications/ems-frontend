import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FileExplorerWidgetComponent } from './file-explorer-widget.component';
import { CommonModule } from '@angular/common';

export default {
  title: 'File explorer widget',
  component: FileExplorerWidgetComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FileExplorerWidgetComponent],
    }),
  ],
} as Meta<FileExplorerWidgetComponent>;

const Template: Story<FileExplorerWidgetComponent> = (
  args: FileExplorerWidgetComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
