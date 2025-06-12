import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FileExplorerTableComponent } from './file-explorer-table.component';

export default {
  title: 'File explorer table',
  component: FileExplorerTableComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FileExplorerTableComponent],
    }),
  ],
} as Meta<FileExplorerTableComponent>;

const Template: Story<FileExplorerTableComponent> = (
  args: FileExplorerTableComponent
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {};
