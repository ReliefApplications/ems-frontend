import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { AutocompleteModule } from './autocomplete.module';
import { AutocompleteOptions } from './interfaces/autocomplete-options.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteDirective } from './autocomplete.directive';

/** Autocomplete options example */
const SIMPLE_OPTIONS: AutocompleteOptions[] = [
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
const GROUPED_OPTIONS: AutocompleteOptions[] = [
  {
    label: 'A',
    children: [
      {
        label: 'option A 1',
      },
    ],
  },
  {
    label: 'B',
    children: [
      {
        label: 'B 1',
      },
      {
        label: 'b',
      },
    ],
  },
  {
    label: 'C',
  },
  {
    label: 'D',
    children: [
      {
        label: 'D 1',
      },
      {
        label: 'D two',
      },
      {
        label: 'D a b',
      },
    ],
  },
];

export default {
  title: 'Autocomplete',
  decorators: [
    moduleMetadata({
      imports: [AutocompleteModule, ReactiveFormsModule],
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
  console.log('Option selected: ', option);
};

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
        uiAutocomplete
        [uiAutocompleteOptions]="options"
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
        uiAutocomplete
        [uiAutocompleteOptions]="options"
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
  const formControl = new FormControl('');
  args.options = SIMPLE_OPTIONS;
  return {
    template: `
      <form>
        <input
          matInput
          type="text"
          [formControl]="formControl"
          placeholder="Select a value to the form group"
          uiAutocomplete
          [uiAutocompleteOptions]="options"
          (opened)="openedAutocompletePanel()"
          (closed)="closesAutocompletePanel()"
          (optionSelected)="selectedOption($event)"
          class="relative w-full rounded-md border-0 p-1.5 shadow-sm ring-1 ring-inset sm:leading-6 focus:ring-2 focus:ring-inset"
        >
      </form>
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
