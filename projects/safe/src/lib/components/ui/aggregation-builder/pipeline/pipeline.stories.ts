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
import { StageType } from './pipeline-stages';
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

const DEFAULT_FIELDS = [
  {
    type: 'tagbox',
    name: 'affected_countriees',
    isRequired: false,
    readOnly: false,
    isCore: true,
    choicesByUrl: {
      url: 'http://localhost:3000/EMRS/referenceData/items/Country',
      path: 'value',
      value: 'Iso2Code',
      text: 'ShortName',
    },
  },
  {
    type: 'tagbox',
    name: 'regions',
    isRequired: false,
    readOnly: false,
    isCore: true,
    choices: ['AFR', 'AMR', 'WMR', 'EUR', 'SEAR', 'WPR'],
  },
  {
    type: 'resources',
    name: 'sources',
    isRequired: false,
    readOnly: false,
    isCore: true,
    resource: '60acfa403e02d700376560be',
    displayField: 'title',
    relatedName: 'signal',
    displayAsGrid: true,
    addTemplate: '60acfa403e02d700376560bf',
    gridFieldsSettings: {
      name: 'allInformation',
      template: null,
      fields: [
        {
          name: 'title',
          type: 'String',
          kind: 'SCALAR',
          label: 'Title',
        },
        {
          name: 'date',
          type: 'Date',
          kind: 'SCALAR',
          label: 'Date',
        },
        {
          name: 'description',
          type: 'String',
          kind: 'SCALAR',
          label: 'Description',
        },
        {
          name: 'disease',
          type: 'String',
          kind: 'SCALAR',
          label: 'Disease',
        },
      ],
      filter: {
        logic: 'and',
        filters: [],
      },
    },
  },
  {
    type: 'date',
    name: 'date',
    isRequired: false,
    readOnly: false,
    isCore: true,
  },
  {
    type: 'text',
    name: 'follow_comment',
    isCore: true,
    generated: true,
  },
  {
    type: 'radiogroup',
    name: 'follow',
    isRequired: false,
    readOnly: false,
    isCore: true,
    choices: ['item1', 'item2', 'item3'],
  },
];

const fb = new FormBuilder();

const TEMPLATE: Story<SafePipelineComponent> = (args) => ({
  template:
    '<safe-pipeline [fields$]=fields$ [pipelineForm]="pipelineForm"></safe-pipeline>',
  props: {
    // Need to pass formArray there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    pipelineForm: new FormArray([
      fb.group({
        type: new FormControl(StageType.FILTER),
        form: fb.group({
          logic: 'and',
          filters: fb.array([]),
        }),
      }),
      fb.group({
        type: new FormControl(StageType.SORT),
        value: new FormControl('Sort'),
      }),
    ]),
    fields$: new BehaviorSubject(DEFAULT_FIELDS)
      .asObservable()
      .pipe(delay(500)),
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.args = {};
