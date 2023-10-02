import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { AutocompleteModule } from './autocomplete.module';
import { AutocompleteComponent } from './autocomplete.component';
import { IconModule } from '../icon/icon.module';
import { CommonModule } from '@angular/common';

/** Autocomplete options example */
const SIMPLE_OPTIONS = [
  {
    label: 'A',
  },
  {
    label: 'a B',
  },
  {
    label: 'C',
  },
  {
    label: 'D',
  },
];

/** Autocomplete grouped options example */
const GROUPED_OPTIONS = [
  {
    optionName: 'A',
    channels: [
      {
        optionName: 'option A 1',
      },
    ],
  },
  {
    optionName: 'B',
    channels: [
      {
        optionName: 'B 1',
      },
      {
        optionName: 'b',
      },
    ],
  },
  {
    optionName: 'C',
  },
  {
    optionName: 'D',
    channels: [
      {
        optionName: 'D 1',
      },
      {
        optionName: 'D two',
      },
      {
        optionName: 'D a b',
      },
    ],
  },
];

export default {
  title: 'Components/Autocomplete',
  tags: ['autodocs'],
  component: AutocompleteComponent,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        AutocompleteModule,
        ReactiveFormsModule,
        IconModule,
      ],
    }),
  ],
} as Meta<AutocompleteComponent>;

/** Callback to test the autocomplete directive opened event */
const openedAutocompletePanel = () => {
  console.log('Opened autocomplete panel event');
};

/** Callback to test the autocomplete directive closed event */
const closesAutocompletePanel = () => {
  console.log('Closed autocomplete panel event');
};

/**
 * Callback to test the autocomplete directive optionSelected event
 *
 * @param option Option selected
 */
const selectedOption = (option: string) => {
  console.log('Option selected: ', option);
};

/**
 * Form control to test autocomplete story
 */
const formControl = new FormControl();

/**
 * Simple autocomplete template
 *
 * @param {any} args args
 * @returns AutocompleteDirective
 */
const SimpleAutocompletePanelTemplate: StoryFn<any> = (args: any) => {
  return {
    component: AutocompleteComponent,
    template: `
      <input
        type="text"
        placeholder="Select a value"
        [uiAutocomplete]="auto"
        [autocompleteDisplayKey]="'label'"
        (opened)="openedAutocompletePanel()"
        (closed)="closesAutocompletePanel()"
        (optionSelected)="selectedOption($event)"
        class="relative w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset sm:leading-6 focus:ring-2 focus:ring-inset"
      >
      <ui-autocomplete #auto>
      <ui-option *ngFor="let option of SIMPLE_OPTIONS" [value]="option">
        {{option.label}}
        <ng-container ngProjectsAs="icon">
        <ui-icon
          icon="edit"
          [size]="18"
        ></ui-icon>
        </ng-container>
      </ui-option>
      <ui-autocomplete>
    `,
    props: {
      ...args,
      SIMPLE_OPTIONS,
      openedAutocompletePanel,
      closesAutocompletePanel,
      selectedOption,
    },
  };
};

/** Autocomplete panel inject in a input with simples (not grouped) options */
export const SimpleAutocompletePanel = SimpleAutocompletePanelTemplate.bind({});

/**
 * Grouped autocomplete template
 *
 * @param {any} args args
 * @returns AutocompleteDirective
 */
const GroupedAutocompletePanelTemplate: StoryFn<any> = (args: any) => {
  return {
    template: `
    <input
    type="text"
    placeholder="Select a value"
    [uiAutocomplete]="auto"
    [autocompleteDisplayKey]="'optionName'"
    (opened)="openedAutocompletePanel()"
    (closed)="closesAutocompletePanel()"
    (optionSelected)="selectedOption($event)"
    class="relative w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset sm:leading-6 focus:ring-2 focus:ring-inset"
  >
  <ui-autocomplete #auto>
  <ui-option [isGroup]="true" *ngFor="let option of GROUPED_OPTIONS">
    {{option.optionName}}
    <ui-option *ngFor="let child of option.channels" [value]="child">
    {{child.optionName}}
    <ng-container ngProjectsAs="icon">
    <ui-icon
      icon="edit"
      [size]="18"
    ></ui-icon>
    </ng-container>
  </ui-option>
  </ui-option>
  <ui-autocomplete>
    `,
    props: {
      ...args,
      GROUPED_OPTIONS,
      openedAutocompletePanel,
      closesAutocompletePanel,
      selectedOption,
    },
  };
};

/** Autocomplete panel inject in a input with grouped options */
export const GroupedAutocompletePanel = GroupedAutocompletePanelTemplate.bind(
  {}
);

/**
 * Form control template autocomplete
 *
 * @param {any} args args
 * @returns AutocompleteDirective
 */
const FormControlTemplate: StoryFn<any> = (args: any) => {
  formControl.setValue(SIMPLE_OPTIONS[2]);
  return {
    template: `
    <input
    type="text"
    placeholder="Select a value"
    [formControl]="formControl"
    [uiAutocomplete]="auto"
    [autocompleteDisplayKey]="'label'"
    (opened)="openedAutocompletePanel()"
    (closed)="closesAutocompletePanel()"
    (optionSelected)="selectedOption($event)"
    class="relative w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset sm:leading-6 focus:ring-2 focus:ring-inset"
  >
  <ui-autocomplete #auto>
  <ui-option *ngFor="let option of SIMPLE_OPTIONS" [value]="option">
    {{option.label}}
    <ng-container ngProjectsAs="icon">
    <ui-icon
      icon="edit"
      [size]="18"
    ></ui-icon>
    </ng-container>
  </ui-option>
  </ui-autocomplete>
      <br>
      <p>value: {{formControl.value | json}}</p>
      <p>touched: {{formControl.touched}}</p>
    `,
    props: {
      ...args,
      SIMPLE_OPTIONS,
      formControl,
      openedAutocompletePanel,
      closesAutocompletePanel,
      selectedOption,
    },
  };
};

/** Form control autocomplete */
export const FormAutocomplete = FormControlTemplate.bind({});
