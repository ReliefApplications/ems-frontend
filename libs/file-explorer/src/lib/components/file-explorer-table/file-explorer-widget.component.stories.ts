import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FileExplorerTableComponent } from './file-explorer-table.component';

export default {
  title: 'Components/File explorer table',
  component: FileExplorerTableComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FileExplorerTableComponent],
    }),
  ],
} as Meta<FileExplorerTableComponent>;

/**
 * Base template
 *
 * @param args arguments
 * @returns story
 */
const Template: Story<FileExplorerTableComponent> = (
  args: FileExplorerTableComponent
) => ({
  props: args,
});

/**
 * Main story
 */
export const Primary = Template.bind({});
Primary.args = {};
