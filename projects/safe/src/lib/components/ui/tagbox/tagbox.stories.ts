import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeTagboxComponent } from './tagbox.component';
import { SafeTagboxModule } from './tagbox.module';
import { StorybookTranslateModule } from '../../storybook-translate/storybook-translate-module';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

export default {
  component: SafeTagboxComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeTagboxModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
      ],
    }),
  ],
  title: 'UI/Tagbox',
  args: {
    separatorKeysCodes: [ENTER, COMMA],
  },
} as Meta;

const TEMPLATE: Story<SafeTagboxComponent> = (args) => ({
  template:
    '<safe-tagbox [choices$]=choices$ [parentControl]=parentControl [label]=label></safe-tagbox>',
  props: {
    ...args,
  },
});

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
    type: 'dropdown',
    name: 'disease',
    isRequired: false,
    readOnly: false,
    isCore: true,
    choicesByUrl: {
      url: 'http://localhost:3000/EMRS/referenceData/items/DiseaseCond',
      path: 'value',
      value: 'Id',
      text: 'Name',
    },
  },
  {
    type: 'text',
    name: 'title',
    isRequired: false,
    readOnly: false,
    isCore: true,
  },
  {
    type: 'text',
    name: 'description',
    isRequired: false,
    readOnly: false,
    isCore: true,
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

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {
  label: 'Select fields',
  choices$: new BehaviorSubject(DEFAULT_FIELDS).asObservable().pipe(delay(500)),
  availableChoices: new BehaviorSubject<any>([]),
  selectedChoices: [],
  parentControl: new FormControl([]),
  inputControl: new FormControl(),
};

export const INITIAL_SOURCE = TEMPLATE.bind({});
DEFAULT.storyName = 'Initial source';
INITIAL_SOURCE.args = {
  ...DEFAULT.args,
  parentControl: new FormControl(['follow', 'date']),
};
