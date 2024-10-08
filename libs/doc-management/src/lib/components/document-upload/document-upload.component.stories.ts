import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { DocumentUploadComponent } from './document-upload.component';

/** Meta for document upload component. */
const meta: Meta<DocumentUploadComponent> = {
  title: 'Document Upload',
  component: DocumentUploadComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
  args: {
    token: '',
  },
};
export default meta;

type DocumentUploadStory = StoryObj<DocumentUploadComponent>;

/** Default story. */
export const Default: DocumentUploadStory = {};
