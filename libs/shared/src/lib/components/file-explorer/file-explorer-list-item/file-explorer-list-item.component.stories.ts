import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FileIconPipe } from '../../../pipes/file-icon/file-icon.pipe';
import { FileExplorerListItemComponent } from './file-explorer-list-item.component';
import { FileExplorerDocument } from '../types/file-explorer-document.type';

export default {
  title: 'Components/List Item',
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FileExplorerListItemComponent, FileIconPipe],
    }),
  ],
} as Meta;

/** Base document */
const baseDocument: FileExplorerDocument = {
  id: 'testfile',
  filename: '',
  createddate: '2024-03-02T11:45:10Z',
  modifieddate: '2024-03-02T13:12:45Z',
  modifiedbyuser: {
    firstname: 'Carlos',
    lastname: 'Mendoza',
  },
};

/** List of all documents */
const allDocuments: FileExplorerDocument[] = [
  { ...baseDocument, filename: 'report.pdf' },
  { ...baseDocument, filename: 'contract.doc' },
  { ...baseDocument, filename: 'contract.docx' },
  { ...baseDocument, filename: 'data.xls' },
  { ...baseDocument, filename: 'data.xlsx' },
  { ...baseDocument, filename: 'photo.png' },
  { ...baseDocument, filename: 'image.jpg' },
  { ...baseDocument, filename: 'picture.jpeg' },
  { ...baseDocument, filename: 'animation.gif' },
  { ...baseDocument, filename: 'archive.zip' },
  { ...baseDocument, filename: 'notes.txt' },
  { ...baseDocument, filename: 'readme.md' },
  { ...baseDocument, filename: 'unknownfile.xyz' },
];

/**
 * Story to show all types.
 *
 * @returns story
 */
export const AllTypes: Story = () => ({
  template: `
    <div class="flex flex-row flex-wrap gap-2">
      <ng-container *ngFor="let doc of documents">
        <oort-front-file-explorer-list-item [document]="doc"></oort-front-file-explorer-list-item>
      </ng-container>
    </div>
  `,
  props: { documents: allDocuments },
});
