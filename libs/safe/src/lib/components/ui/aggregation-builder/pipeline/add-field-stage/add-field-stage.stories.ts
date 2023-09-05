import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { SafeAddFieldStageComponent } from './add-field-stage.component';
import { SafePipelineModule } from '../pipeline.module';
import { StorybookTranslateModule } from '../../../../storybook-translate/storybook-translate-module';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Accumulators } from '../expressions/operators';

export default {
  component: SafeAddFieldStageComponent,
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
  title: 'UI/Aggregation builder/Stages/Add fields',
  args: {
    currentForms: [],
    filteredForms: [],
  },
} as Meta;

/** Defining the default fields that are available in the storybook */
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

/** Creating a new instance of the FormBuilder class. */
const fb = new UntypedFormBuilder();

/**
 * Defines a template for the component SafeAddFieldStageComponent to use as/in a playground
 *
 * @returns the template
 */
const TEMPLATE: StoryFn<SafeAddFieldStageComponent> = () => ({
  template:
    '<safe-add-field-stage [form]=form [fields]=fields [operators]=operators></safe-add-field-stage>',
  props: {
    // Need to pass formGroup there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    form: fb.array([]),
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
