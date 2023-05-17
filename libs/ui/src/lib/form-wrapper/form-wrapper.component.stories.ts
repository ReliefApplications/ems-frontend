import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormWrapperModule } from './form-wrapper.module';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { SelectMenuModule } from '../select-menu/select-menu.module';
import { SelectOptionModule } from '../select-menu/components/select-option.module';

export default {
  title: 'Form Wrapper',
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormWrapperModule,
        IconModule,
        SpinnerModule,
        SelectMenuModule,
        SelectOptionModule,
      ],
    }),
  ],
} as Meta<any>;

/**
 * List of options for the select menu included template
 */
const options = [
  'french',
  'spanish',
  'english',
  'japanese',
  'javanese',
  'chinese',
];

/**
 * Template to create form wrapper component's story
 *
 * @param args args
 * @returns StoryFn<FormWrapperComponent> story
 */
const Template: StoryFn<any> = (args: any) => {
  return {
    template: `<div uiFormFieldDirective [outline]="${args.outline}">
    <label>Phone Number</label>
    <input type="text" name="account-number" id="account-number" placeholder="000-00-0000"/>
    <ui-spinner uiSuffix></ui-spinner>
    <ui-icon icon="search" uiPrefix></ui-icon>
  </div>`,
    props: {
      ...args,
    },
  };
};

/**
 * Template to create form wrapper component's story using select menu
 *
 * @param args args
 * @returns StoryFn<FormWrapperComponent> story
 */
const TemplateSelect: StoryFn<any> = (args: any) => {
  return {
    template: `<div uiFormFieldDirective [outline]="${args.outline}">
    <label>Choose language</label>
    <ui-select-menu 
      [multiselect]="false"
      [disabled]="false">
        <ui-select-option *ngFor="let option of options" [value]="option">
          {{option}}
        </ui-select-option>
    </ui-select-menu>
    <ui-spinner uiSuffix></ui-spinner>
    <ui-icon icon="search" uiPrefix></ui-icon>
  </div>`,
    props: {
      ...args,
      options,
    },
  };
};

/**
 * Outline = False design + use of select menu
 */
export const OutlineFalseSelect = TemplateSelect.bind({});
OutlineFalseSelect.args = {
  outline: false,
};

/**
 * Outline = True design + use of select menu
 */
export const OutlineTrueSelect = TemplateSelect.bind({});
OutlineTrueSelect.args = {
  outline: true,
};

/**
 * Outline = False design
 */
export const OutlineFalse = Template.bind({});
OutlineFalse.args = {
  outline: false,
};

/**
 * Outline = True design
 */
export const OutlineTrue = Template.bind({});
OutlineTrue.args = {
  outline: true,
};
