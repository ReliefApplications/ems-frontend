import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, StoryFn } from '@storybook/angular';
import { MappingComponent } from './mapping.component';
import { MappingModule } from './mapping.module';
import { StorybookTranslateModule } from '../storybook-translate/storybook-translate-module';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';

export default {
  component: MappingComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        MappingModule,
        BrowserAnimationsModule,
        StorybookTranslateModule,
        ReactiveFormsModule,
        DialogCdkModule,
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
const TEMPLATE: StoryFn<MappingComponent> = () => ({
  template: '<shared-mapping [mappingForm]="mappingForm"></shared-mapping>',
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
 * Default story.
 */
export const DEFAULT = {
  render: TEMPLATE,
  name: 'Full',
  args: {},
};

/**
 * Story template with no mapping
 *
 * @returns story
 */
const TEMPLATE_EMPTY: StoryFn<MappingComponent> = () => ({
  template: '<shared-mapping [mappingForm]="mappingForm"></shared-mapping>',
  props: {
    // Need to pass formArray there otherwise we get an error: https://github.com/storybookjs/storybook/discussions/15602
    mappingForm: new UntypedFormArray([]),
  },
});

/**
 * Empty story.
 */
export const EMPTY = {
  render: TEMPLATE_EMPTY,
  name: 'Empty',
  args: {},
};
