import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafePipelineComponent } from './pipeline.component';
import { SafePipelineModule } from './pipeline.module';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { PipelineStage } from './pipeline-stage.enum';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export default {
  component: SafePipelineComponent,
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
  title: 'UI/Aggregation builder/Pipeline',
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
    args: [
      {
        name: 'display',
        type: {
          name: 'Boolean',
          kind: 'SCALAR',
          inputFields: null,
        },
      },
    ],
    type: {
      name: 'String',
      kind: 'SCALAR',
      ofType: null,
    },
  },
];

/**
 * Default meta for the pipeline fields.
 */
const DEFAULT_META = {
  date: {
    type: 'date',
    name: 'date',
    isRequired: false,
    readOnly: false,
    isCore: true,
  },
  description: {
    type: 'text',
    name: 'description',
    isRequired: false,
    readOnly: false,
    isCore: true,
  },
  status: {
    type: 'radiogroup',
    name: 'status',
    isRequired: false,
    readOnly: false,
    isCore: true,
    defaultValue: 'Unprocessed',
    choices: [
      {
        text: 'Processed',
        value: 'Processed',
      },
      {
        text: 'Unprocessed',
        value: 'Unprocessed',
      },
    ],
  },
};

/**
 * Form builder reference
 */
const fb = new FormBuilder();

/**
 * Template used by storybook to display the component.
 *
 * @param args story arguments
 * @returns storybook template
 */
const TEMPLATE: Story<SafePipelineComponent> = (args) => ({
  template:
    '<safe-pipeline [fields$]=fields$ [metaFields$]=metaFields$ [pipelineForm]="pipelineForm"></safe-pipeline>',
  props: {
    // Need to pass formArray there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    pipelineForm: new FormArray([
      fb.group({
        type: new FormControl(PipelineStage.FILTER),
        form: fb.group({
          logic: 'and',
          filters: fb.array([]),
        }),
      }),
      fb.group({
        type: new FormControl(PipelineStage.SORT),
        form: fb.group({
          field: [''],
          order: ['asc'],
        }),
      }),
    ]),
    fields$: new BehaviorSubject(DEFAULT_FIELDS)
      .asObservable()
      .pipe(delay(500)),
    metaFields$: new BehaviorSubject(DEFAULT_META)
      .asObservable()
      .pipe(delay(500)),
  },
});

/**
 * Default story
 */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {};
