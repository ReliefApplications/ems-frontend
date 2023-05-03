import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { AutocompleteDirective } from './autocomplete.directive';

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
  title: 'Autocomplete',
  decorators: [
    moduleMetadata({
      declarations: [AutocompleteDirective],
      imports: [ReactiveFormsModule],
    }),
  ],
} as Meta<AutocompleteDirective>;

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
  formControl.setValue(option);
  console.log('Option selected: ', option);
};

/**
 * Form control to test autocomplete story
 */
const formControl = new FormControl('');

/**
 * Simple autocomplete template
 *
 * @param {AutocompleteDirective} args args
 * @returns AutocompleteDirective
 */
const SimpleAutocompletePanelTemplate: StoryFn<AutocompleteDirective> = (
  args: AutocompleteDirective
) => {
  args.options = SIMPLE_OPTIONS;
  return {
    template: `
      <input
        type="text"
        placeholder="Select a value"
        [uiAutocomplete]="options"
        [displayKey]="'label'"
        (opened)="openedAutocompletePanel()"
        (closed)="closesAutocompletePanel()"
        (optionSelected)="selectedOption($event)"
        class="relative w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset sm:leading-6 focus:ring-2 focus:ring-inset"
      >
    `,
    props: {
      ...args,
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
 * @param {AutocompleteDirective} args args
 * @returns AutocompleteDirective
 */
const GroupedAutocompletePanelTemplate: StoryFn<AutocompleteDirective> = (
  args: AutocompleteDirective
) => {
  args.options = GROUPED_OPTIONS;
  return {
    template: `
      <input
        type="text"
        placeholder="Select a value"
        [uiAutocomplete]="options"
        [displayKey]="'optionName'"
        [childrenKey]="'channels'"
        (opened)="openedAutocompletePanel()"
        (closed)="closesAutocompletePanel()"
        (optionSelected)="selectedOption($event)"
        class="relative w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset sm:leading-6 focus:ring-2 focus:ring-inset"
      >
    `,
    props: {
      ...args,
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
 * @param {AutocompleteDirective} args args
 * @returns AutocompleteDirective
 */
const FormControlTemplate: StoryFn<AutocompleteDirective> = (
  args: AutocompleteDirective
) => {
  args.options = SIMPLE_OPTIONS;
  formControl.setValue(SIMPLE_OPTIONS[2].label);
  return {
    template: `
        <input
          type="text"
          [formControl]="formControl"
          placeholder="Select a value to the form group"
          [uiAutocomplete]="options"
          [displayKey]="'label'"
          (opened)="openedAutocompletePanel()"
          (closed)="closesAutocompletePanel()"
          (optionSelected)="selectedOption($event)"
          class="relative w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset sm:leading-6 focus:ring-2 focus:ring-inset"
        >
      <br>
      <p>value: {{formControl.value}}</p>
      <p>touched: {{formControl.touched}}</p>
    `,
    props: {
      ...args,
      formControl,
      openedAutocompletePanel,
      closesAutocompletePanel,
      selectedOption,
    },
  };
};

/** Form control autocomplete */
export const FormAutocomplete = FormControlTemplate.bind({});
