import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeMappingComponent } from './mapping.component';
import { SafeMappingModule } from './mapping.module';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

export default {
  component: SafeMappingComponent,
  decorators: [
    moduleMetadata({
      imports: [
        SafeMappingModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
        ReactiveFormsModule,
        MatDialogModule,
      ],
      providers: [
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }),
  ],
  title: 'UI/Mapping/Grid',
  args: {
    currentForms: [],
    filteredForms: [],
  },
} as Meta;

/** Angular form builder */
const fb = new FormBuilder();

/**
 * Template for stories
 *
 * @param args stories args
 * @returns story
 */
const TEMPLATE: Story<SafeMappingComponent> = (args) => ({
  template: '<safe-mapping [mappingForm]="mappingForm"></safe-mapping>',
  props: {
    // Need to pass formArray there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    mappingForm: new FormArray([
      fb.group({
        field: ['externalAttributes.region'],
        path: ['userBaseLocation.region'],
        value: ['id'],
        text: ['name'],
      }),
      fb.group({
        field: ['externalAttributes.country'],
        path: ['userBaseLocation.country'],
        value: ['id'],
        text: ['name'],
      }),
    ]),
  },
});

/**
 * Default story
 */
export const DEFAULT = TEMPLATE.bind({});
DEFAULT.storyName = 'Full';
DEFAULT.args = {};

/**
 * Story template with no mapping
 *
 * @param args story args
 * @returns story
 */
const TEMPLATE_EMPTY: Story<SafeMappingComponent> = (args) => ({
  template: '<safe-mapping [mappingForm]="mappingForm"></safe-mapping>',
  props: {
    // Need to pass formArray there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    mappingForm: new FormArray([]),
  },
});

/** Story with no mapping */
export const EMPTY = TEMPLATE_EMPTY.bind({});
EMPTY.storyName = 'Empty';
EMPTY.args = {};
