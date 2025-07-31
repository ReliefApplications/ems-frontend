import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FileExplorerTableComponent } from './file-explorer-table.component';
import { FileExplorerDocument } from '../types/file-explorer-document.type';

/** Mocked list of documents */
const data: FileExplorerDocument[] = [
  {
    id: '1a2b3c4d',
    filename: 'report-2024-01.pdf',
    createddate: '2024-01-15T09:24:00Z',
    modifieddate: '2024-02-10T14:05:30Z',
    modifiedbyuser: {
      firstname: 'Alice',
      lastname: 'Nguyen',
    },
  },
  {
    id: '2b3c4d5e',
    filename: 'meeting-notes.docx',
    createddate: '2024-03-02T11:45:10Z',
    modifieddate: '2024-03-02T13:12:45Z',
    modifiedbyuser: {
      firstname: 'Carlos',
      lastname: 'Mendoza',
    },
  },
  {
    id: '3c4d5e6f',
    filename: 'budget.xlsx',
    createddate: '2024-04-20T08:00:00Z',
    modifieddate: '2024-05-01T16:30:00Z',
    modifiedbyuser: {
      firstname: 'Priya',
      lastname: 'Singh',
    },
  },
  {
    id: '4d5e6f7g',
    filename: 'design-mockup.png',
    createddate: '2024-05-10T10:15:25Z',
    modifieddate: '2024-05-15T12:00:00Z',
    modifiedbyuser: {
      firstname: 'Liu',
      lastname: 'Wei',
    },
  },
  {
    id: '5e6f7g8h',
    filename: 'user-guide.md',
    createddate: '2024-06-01T07:30:00Z',
    modifieddate: '2024-06-10T09:45:00Z',
    modifiedbyuser: {
      firstname: 'Emma',
      lastname: 'Johnson',
    },
  },
  {
    id: '6f7g8h9i',
    filename: 'presentation.pptx',
    createddate: '2024-07-12T14:20:00Z',
    modifieddate: '2024-07-12T15:00:00Z',
    modifiedbyuser: {
      firstname: 'Omar',
      lastname: 'El-Sayed',
    },
  },
  {
    id: '7g8h9i0j',
    filename: 'invoice-1001.pdf',
    createddate: '2024-08-05T09:00:00Z',
    modifieddate: '2024-08-06T10:10:10Z',
    modifiedbyuser: {
      firstname: 'Nina',
      lastname: 'Petrov',
    },
  },
  {
    id: '8h9i0j1k',
    filename: 'archive-2023.zip',
    createddate: '2024-09-15T22:45:00Z',
    modifieddate: '2024-09-16T08:00:00Z',
    modifiedbyuser: {
      firstname: 'John',
      lastname: 'O’Connor',
    },
  },
  {
    id: '9i0j1k2l',
    filename: 'logo.svg',
    createddate: '2024-10-20T05:15:00Z',
    modifieddate: '2024-10-25T06:30:00Z',
    modifiedbyuser: {
      firstname: 'Sara',
      lastname: 'Al-Hashimi',
    },
  },
  {
    id: '0j1k2l3m',
    filename: 'readme.txt',
    createddate: '2024-11-01T12:00:00Z',
    modifieddate: '2024-11-02T13:15:00Z',
    modifiedbyuser: {
      firstname: 'David',
      lastname: 'Kim',
    },
  },
];

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
Primary.args = {
  gridData: data,
};
