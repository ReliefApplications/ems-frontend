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

/** With emergency preselected */
export const EmergencyPreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      Occurrence: '11e274a7-ff23-4136-5b50-08d98a1fa7ee',
    },
  },
};

/** With event preselected */
export const EventPreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      Occurrence: '37f76de2-5f2c-4b93-670d-08d98a1fa7ee',
    },
  },
};

/** With event group preselected */
export const EventGroupPreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      Occurrence: '26d20a54-ff92-4da0-c38e-08d98a1fa1f1',
    },
  },
};

/** With document type preselected */
export const DocumentTypePreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      DocumentType: 27,
    },
  },
};

/** With region preselected */
export const RegionPreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      Region: [4],
    },
  },
};

/** With country preselected */
export const CountryPreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      Country: [60],
    },
  },
};

/** With aetiology preselected */
export const AetiologyPreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      Aetiology: [1067],
    },
  },
};

/** With syndrome preselected */
export const SyndromePreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      Syndrome: [4],
    },
  },
};

/** With hazard preselected */
export const HazardPreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      Hazard: [1],
    },
  },
};

/** With disease condition preselected */
export const DiseaseConditionPreselected: DocumentUploadStory = {
  args: {
    documentConfig: {
      'Disease Condition': [319],
    },
  },
};
