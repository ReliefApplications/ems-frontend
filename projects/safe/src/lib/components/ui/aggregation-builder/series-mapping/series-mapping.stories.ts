import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BehaviorSubject } from 'rxjs';
import { SafeSeriesMappingComponent } from './series-mapping.component';
import { SafeSeriesMappingModule } from './series-mapping.module';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';
import { createAggregationForm } from '../aggregation-builder-forms';
import { delay } from 'rxjs/operators';

export default {
  component: SafeSeriesMappingComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeSeriesMappingModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
      ],
    }),
  ],
  title: 'UI/Aggregation builder/Series mapping',
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

const TEMPLATE: Story<SafeSeriesMappingComponent> = (args) => ({
  template:
    '<safe-series-mapping [fields$]=fields$ [mappingForm]=mappingForm></safe-series-mapping>',
  props: {
    fields$: new BehaviorSubject(DEFAULT_FIELDS)
      .asObservable()
      .pipe(delay(500)),
    mappingForm: createAggregationForm(
      {
        mapping: {
          category: 'date',
          value: 'follow',
        },
      },
      'column'
    ).controls.mapping,
  },
});

export const INITIAL_SOURCE = TEMPLATE.bind({});
INITIAL_SOURCE.args = {
  controlNames: ['xAxis', 'yAxis'],
  availableFields: [],
};
