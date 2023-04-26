import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteModule } from './autocomplete.module';
import { AutocompleteOptions } from './interfaces/autocomplete-options.interface';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

/** Autocomplete options example */
const options: AutocompleteOptions[] = [
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

export default {
  title: 'Autocomplete',
  component: AutocompleteComponent,
  argTypes: {
    placeholder: {
      control: 'text',
    },
    required: {
      control: 'boolean',
    },
    options: {
      control: 'array',
    },
    disabled: {
      type: 'boolean',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [AutocompleteModule, ReactiveFormsModule],
    }),
  ],
} as Meta<AutocompleteComponent>;

/**
 * Template autocomplete
 *
 * @param {AutocompleteComponent} args args
 * @returns AutocompleteComponent
 */
const Template: StoryFn<AutocompleteComponent> = (
  args: AutocompleteComponent
) => ({
  props: args,
});

/**
 * Form control template autocomplete
 *
 * @param {AutocompleteComponent} args args
 * @returns AutocompleteComponent
 */
const FormControlTemplate: StoryFn<AutocompleteComponent> = (
  args: AutocompleteComponent
) => {
  const formGroup = new FormGroup({
    autocomplete: new FormControl(''),
  });
  args.options = options;
  args.required = true;
  args.placeholder = 'Select a value';
  return {
    component: AutocompleteComponent,
    template: `
      <form [formGroup]="formGroup">
        <ui-autocomplete
          [options]="options"
          [required]="required"
          [placeholder]="placeholder"
          formControlName="autocomplete"
        ></ui-autocomplete>
      </form>
      <br>
      <p>value: {{formGroup.get('autocomplete').value}}</p>
      <p>touched: {{formGroup.get('autocomplete').touched}}</p>
    `,
    props: {
      ...args,
      formGroup,
    },
  };
};

/** Form control autocomplete */
export const FormAutocomplete = FormControlTemplate.bind({});

/** Autocomplete with grouped options */
export const GroupedOptions = Template.bind({});
GroupedOptions.args = {
  required: true,
  options: [
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
  ],
};

/** Autocomplete with simple options */
export const SimpleOptions = Template.bind({});
SimpleOptions.args = {
  placeholder: 'Select a value',
  required: false,
  options,
};
