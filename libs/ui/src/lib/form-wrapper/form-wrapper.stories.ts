import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormWrapperModule } from './form-wrapper.module';
import { IconModule } from '../icon/icon.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { SelectMenuModule } from '../select-menu/select-menu.module';
import { AutocompleteModule } from '../autocomplete/autocomplete.module';
import { ButtonModule } from '../button/button.module';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StorybookTranslateModule } from '../../storybook-translate.module';

export default {
  title: 'Components/Form Wrapper',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormWrapperModule,
        IconModule,
        SpinnerModule,
        SelectMenuModule,
        AutocompleteModule,
        ButtonModule,
        ReactiveFormsModule,
        StorybookTranslateModule,
      ],
    }),
  ],
  argTypes: {
    outline: {
      description: 'Outline design',
      defaultValue: 'false',
      type: 'boolean',
    },
  },
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

/** Form group to test story with disable option */
const formGroup = new FormGroup({
  name: new FormControl(''),
});
/** Callback to test story with disable option */
const toggleDisabled = () => {
  const formControl = formGroup.controls.name;
  if (formControl.disabled) {
    formControl.enable();
  } else {
    formControl.disable();
  }
};

/** Callback to set status of form control to invalid */
const toggleInvalid = () => {
  const formControl = formGroup.controls.name;
  if (formControl.valid) {
    formControl.setErrors({ customError: true });
  } else {
    formControl.setErrors(null);
  }
};

/**
 * Template to create form wrapper component's story
 *
 * @param args args
 * @returns StoryFn<FormWrapperComponent> story
 */
const Template: StoryFn<any> = (args: any) => {
  return {
    template: `
    <div [formGroup]="formGroup">
    <div uiFormFieldDirective [outline]="${args.outline}">
    <label>Phone Number</label>
    <input type="text" name="account-number" id="account-number" placeholder="000-00-0000" formControlName="name"/>
    <ui-spinner [size]="'medium'" uiSuffix></ui-spinner>
    <ui-icon icon="search" uiPrefix></ui-icon>
  </div></div>
  <ui-button (click)="toggleDisabled()">
  Enable/disabled
</ui-button>
<ui-button (click)="toggleInvalid()">
  Valid/Invalid
</ui-button>
  `,
    props: {
      ...args,
      toggleInvalid,
      toggleDisabled,
      formGroup,
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
    template: `
    <div [formGroup]="formGroup">
    <div uiFormFieldDirective [outline]="${args.outline}">
    <label>Choose language</label>
    <ui-select-menu 
      formControlName="name"
      [multiselect]="false"
      [disabled]="false">
        <ui-select-option *ngFor="let option of options" [value]="option">
          {{option}}
        </ui-select-option>
    </ui-select-menu>
    <ui-spinner [size]="'medium'" uiSuffix></ui-spinner>
    <ui-icon icon="search" uiPrefix></ui-icon>
  </div>
    </div>
    <ui-button (click)="toggleDisabled()">
    Enable/disabled
  </ui-button>
  <ui-button (click)="toggleInvalid()">
    Valid/Invalid
  </ui-button>
  `,
    props: {
      ...args,
      options,
      toggleInvalid,
      toggleDisabled,
      formGroup,
    },
  };
};

/**
 * Template to create form wrapper component's story using autocomplete
 *
 * @param args args
 * @returns StoryFn<FormWrapperComponent> story
 */
const TemplateAutocomplete: StoryFn<any> = (args: any) => {
  return {
    template: `
    <div [formGroup]="formGroup">
      <div uiFormFieldDirective  [outline]="${args.outline}">
        <label>Choose language</label>
        <input
          formControlName="name"
          type="text"
          placeholder="Select a value"
          [uiAutocomplete]="auto"
          (optionSelected)="selectedOption($event)"
        >
        <ui-autocomplete #auto>
          <ui-option *ngFor="let option of options" [value]="option">
            {{option}}
            <ng-container ngProjectsAs="icon">
              <ui-icon
                [icon]="'edit'"
                [size]="18"
              ></ui-icon>
            </ng-container>
          </ui-option>
        </ui-autocomplete>
        <ui-spinner [size]="'medium'" uiSuffix></ui-spinner>
        <ui-icon icon="search" uiPrefix></ui-icon>
    </div>
  </div>
  <ui-button (click)="toggleDisabled()">
    Enable/disabled
  </ui-button>
  <ui-button (click)="toggleInvalid()">
    Valid/Invalid
  </ui-button>
  `,
    props: {
      ...args,
      options,
      toggleDisabled,
      toggleInvalid,
      formGroup,
    },
  };
};

/**
 * Outline = False design + use of autocomplete
 */
export const OutlineFalseAutocomplete = TemplateAutocomplete.bind({});
OutlineFalseAutocomplete.args = {
  outline: false,
};

/**
 * Outline = True design + use of autocomplete
 */
export const OutlineTrueAutocomplete = TemplateAutocomplete.bind({});
OutlineTrueAutocomplete.args = {
  outline: true,
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
