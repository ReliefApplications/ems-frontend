import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeExpressionsComponent } from './expressions.component';
import { SafePipelineModule } from '../pipeline.module';
import { StorybookTranslateModule } from '../../../../storybook-translate/storybook-translate-module';
import {
  UntypedFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Accumulators } from './operators';

export default {
  component: SafeExpressionsComponent,
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
  title: 'UI/Aggregation builder/Stages/Expressions',
  args: {
    currentForms: [],
    filteredForms: [],
  },
} as Meta;

/**
 * List of fields for testing.
 */
const DEFAULT_FIELDS = [
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

/**
 * Form builder reference.
 */
const fb = new UntypedFormBuilder();

/**
 * Template used by storybook to display the component in stories.
 *
 * @returns story template
 */
const TEMPLATE: StoryFn<SafeExpressionsComponent> = () => ({
  template:
    '<safe-expressions [form]=form [fields]=fields [operators]=operators></safe-expressions>',
  props: {
    // Need to pass formGroup there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    form: fb.group({
      operator: ['', Validators.required],
      field: ['', Validators.required],
    }),
    fields: DEFAULT_FIELDS,
    operators: Accumulators,
  },
});

/**
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Default',
  args: {},
};
