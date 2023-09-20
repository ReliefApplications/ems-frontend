import { moduleMetadata } from '@storybook/angular';
import { SafePipelineModule } from '../../../public-api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorybookTranslateModule } from '../../../../../storybook-translate/storybook-translate-module';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Shared stories config for pipeline components
 */
export const SHARED_PIPELINE_STORIES_CONFIG = {
  decorators: [
    moduleMetadata({
      imports: [
        SafePipelineModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }),
  ],
  title: '',
  args: {
    currentForms: [],
    filteredForms: [],
  },
};

/**
 * List of fields for testing.
 */
export const DEFAULT_FIELDS = [
  {
    name: 'date',
    args: [],
    type: {
      name: 'Date',
      kind: 'SCALAR',
      ofType: null,
    },
  },
  {
    name: 'description',
    args: [],
    type: {
      name: 'String',
      kind: 'SCALAR',
      ofType: null,
    },
  },
  {
    name: 'status',
    type: {
      name: 'String',
      kind: 'SCALAR',
      ofType: null,
    },
  },
];
