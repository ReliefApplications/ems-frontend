import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeGroupStageComponent } from './group-stage.component';
import { SafePipelineModule } from '../pipeline.module';
import { StorybookTranslateModule } from '../../../../storybook-translate/storybook-translate-module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

export default {
  component: SafeGroupStageComponent,
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
  title: 'UI/Aggregation builder/Stages/Group',
  args: {
    currentForms: [],
    filteredForms: [],
  },
} as Meta;

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

const fb = new FormBuilder();

const TEMPLATE: Story<SafeGroupStageComponent> = (args) => ({
  template: '<safe-group-stage [form]=form [fields]=fields></safe-group-stage>',
  props: {
    // Need to pass formGroup there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    form: fb.group({
      groupBy: ['status', Validators.required],
      addFields: fb.array([]),
    }),
    fields: DEFAULT_FIELDS,
  },
});

export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Default';
DEFAULT.args = {};
