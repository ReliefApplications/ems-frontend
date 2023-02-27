import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { SafeMappingComponent } from './mapping.component';
import { SafeMappingModule } from './mapping.module';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

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
const fb = new UntypedFormBuilder();

/**
 * Template for stories
 *
 * @returns story
 */
const TEMPLATE: Story<SafeMappingComponent> = () => ({
  template: '<safe-mapping [mappingForm]="mappingForm"></safe-mapping>',
  props: {
    // Need to pass formArray there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    mappingForm: new UntypedFormArray([
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
 * @returns story
 */
const TEMPLATE_EMPTY: Story<SafeMappingComponent> = () => ({
  template: '<safe-mapping [mappingForm]="mappingForm"></safe-mapping>',
  props: {
    // Need to pass formArray there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    mappingForm: new UntypedFormArray([]),
  },
});

/** Story with no mapping */
export const EMPTY = TEMPLATE_EMPTY.bind({});
EMPTY.storyName = 'Empty';
EMPTY.args = {};
