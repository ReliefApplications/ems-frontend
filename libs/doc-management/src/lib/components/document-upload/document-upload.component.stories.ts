import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { DocumentUploadComponent } from './document-upload.component';

export default {
  title: 'DocumentUploadComponent',
  component: DocumentUploadComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    }),
  ],
} as Meta<DocumentUploadComponent>;

type DocumentUploadStory = StoryObj<DocumentUploadComponent>;

export const Default: DocumentUploadStory = {};
