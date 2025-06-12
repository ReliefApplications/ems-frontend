import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FileExplorerWidgetComponent } from './file-explorer-widget.component';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';

export default {
  title: 'FileExplorerWidgetComponent',
  component: FileExplorerWidgetComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, LayoutModule, FileExplorerWidgetComponent],
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
