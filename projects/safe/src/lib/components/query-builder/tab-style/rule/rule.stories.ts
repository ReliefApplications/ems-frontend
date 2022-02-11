import { HttpClientModule } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { StorybookTranslateModule } from '../../../storybook-translate/storybook-translate-module';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeTabFieldsComponent } from '../../tab-fields/tab-fields.component';
import { SafeTabFilterComponent } from '../../tab-filter/tab-filter.component';
import { SafeRuleComponent } from './rule.component';

export default {
  component: SafeRuleComponent,
  decorators: [
    moduleMetadata({
      declarations: [
        SafeRuleComponent,
        SafeTabFilterComponent,
        SafeTabFieldsComponent,
      ],
      imports: [
        SafeButtonModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatRadioModule,
        MatOptionModule,
        TranslateModule,
        StorybookTranslateModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
      ],
      providers: [
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }),
  ],
  title: 'UI/Rule',
} as Meta;

const TEMPLATE_DEFAULT: Story<SafeRuleComponent> = (args) => ({
  template: `<safe-rule [stylesList]="stylesList" [styleForm]="styleForm" [styleIndex]="styleIndex" 
  [scalarFields]="scalarFields" [settings]="settings" [availableFields]="availableFields" [factory]="factory"></safe-rule>`,
  props: {
    ...args,
  },
});

const styleFormGroup = {
  title: new FormControl(''),
  backgroundColor: new FormControl(null),
  textColor: new FormControl(null),
  textStyle: new FormControl(null),
  styleAppliedTo: new FormControl('whole-row'),
  fields: new FormControl([]),
  filter: new FormControl({
    logic: 'and',
    filters: [],
  }),
};

// let styleFormGroup = {
//     "formGroup": {
//     title: "Underline",
//     backgroundColor: "rgba(19, 210, 35, 1)",
//     textColor: "rgba(0, 0, 0, 1)",
//     textStyle: "underline",
//     styleAppliedTo: "whole-row",
//     fields: [],
//     filter: {
//       logic: 'and',
//       filters: []
//     },
//   },
// }

export const DEFAULT = TEMPLATE_DEFAULT.bind({});

// DEFAULT.args = {
//   availableFields: [
//     {
//       args: [],
//       name: 'comment',
//       type: {
//         kind: 'SCALAR',
//         name: 'String',
//         ofType: null,
//         __typename: '__Type',
//       },
//       __typename: '__Field',
//     },
//     {
//       args: [],
//       name: 'createdAt',
//       type: {
//         kind: 'SCALAR',
//         name: 'DateTime',
//         ofType: null,
//         __typename: '__Type',
//       },
//       __typename: '__Field',
//     },
//     {
//       args: [],
//       name: 'createdBy',
//       type: {
//         kind: 'OBJECT',
//         name: 'User',
//         ofType: null,
//         __typename: '__Type',
//       },
//       __typename: '__Field',
//     },
//   ],
//   settings: {
//     actions: {
//       addRecord: false,
//       convert: true,
//       delete: true,
//       history: true,
//       inlineEdition: true,
//       update: true,
//     },
//     floatingButtons: [],
//     id: 7,
//     resource: '616839db04ef57001f8ca8c2',
//     title: 'New grid',
//     query: {
//       fields: [
//         {
//           kind: 'SCALAR',
//           label: 'Comment',
//           name: 'comment',
//           type: 'String',
//         },
//         {
//           kind: 'SCALAR',
//           label: 'Incremental Id',
//           name: 'incrementalId',
//           type: 'ID',
//         },
//       ],
//       filter: {
//         logic: 'or',
//         filters: [],
//       },
//       name: 'allLotsOfRecords',
//       sort: {
//         field: '',
//         order: 'asc',
//       },
//       template: '',
//       style: [
//         {
//           backgroundColor: 'rgba(19, 210, 35, 1)',
//           fields: [],
//           filter: {
//             logic: 'and',
//             filters: [
//               {
//                 field: 'comment',
//                 operator: 'contains',
//                 value: 'commentaire',
//               },
//             ],
//           },
//           styleAppliedTo: 'whole-row',
//           textColor: 'rgba(0, 0, 0, 1)',
//           textStyle: 'underline',
//           title: 'Underline',
//         },
//         {
//           backgroundColor: 'rgba(255, 0, 0, 1)',
//           fields: [],
//           filter: {
//             logic: 'and',
//             filters: [
//               {
//                 field: 'comment',
//                 operator: 'contains',
//                 value: 'commentaire',
//               },
//             ],
//           },
//           styleAppliedTo: 'whole-row',
//           textColor: 'rgba(0, 0, 0, 1)',
//           textStyle: 'bold',
//           title: 'Bold',
//         },
//       ],
//     },
//   },
//   scalarFields: [
//     {
//       args: [],
//       name: 'comment',
//       type: {
//         kind: 'SCALAR',
//         name: 'String',
//         ofType: null,
//         __typename: '__Type',
//       },
//       __typename: '__Field',
//     },
//     {
//       args: [],
//       name: 'createdAt',
//       type: {
//         kind: 'SCALAR',
//         name: 'DateTime',
//         ofType: null,
//         __typename: '__Type',
//       },
//       __typename: '__Field',
//     },
//     {
//       args: [],
//       name: 'id',
//       type: {
//         kind: 'SCALAR',
//         name: 'ID',
//         ofType: null,
//         __typename: '__Type',
//       },
//       __typename: '__Field',
//     },
//   ],
//   styleForm: {
//     formGroup: {
//       title: 'Underline',
//       backgroundColor: 'rgba(19, 210, 35, 1)',
//       textColor: 'rgba(0, 0, 0, 1)',
//       textStyle: 'underline',
//       styleAppliedTo: 'whole-row',
//       fields: [],
//       filter: {
//         logic: 'and',
//         filters: [],
//       },
//     },
//   } as any,
//   stylesList: [
//     {
//       backgroundColor: 'rgba(19, 210, 35, 1)',
//       fields: [],
//       filter: {
//         logic: 'and',
//         filters: [
//           {
//             field: 'comment',
//             operator: 'contains',
//             value: 'commentaire',
//           },
//         ],
//       },
//       styleAppliedTo: 'whole-row',
//       textColor: 'rgba(0, 0, 0, 1)',
//       textStyle: 'underline',
//       title: 'Underline',
//     },
//     {
//       backgroundColor: 'rgba(255, 0, 0, 1)',
//       fields: [],
//       filter: {
//         logic: 'and',
//         filters: [
//           {
//             field: 'comment',
//             operator: 'contains',
//             value: 'commentaire',
//           },
//         ],
//       },
//       styleAppliedTo: 'whole-row',
//       textColor: 'rgba(0, 0, 0, 1)',
//       textStyle: 'bold',
//       title: 'Bold',
//     },
//     {
//       backgroundColor: 'rgba(64, 55, 161, 1)',
//       fields: [],
//       filter: {
//         logic: 'and',
//         filters: [
//           {
//             field: 'comment',
//             operator: 'contains',
//             value: 'commentaire',
//           },
//         ],
//       },
//       styleAppliedTo: 'whole-row',
//       textColor: 'rgba(0, 0, 0, 1)',
//       textStyle: 'italic',
//       title: 'Italic',
//     },
//   ],
// };
