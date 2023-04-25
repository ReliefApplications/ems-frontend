import { moduleMetadata, Meta, StoryObj } from '@storybook/angular';
import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteModule } from './autocomplete.module';
import { AutocompleteOptions } from './interfaces/autocomplete-options.interface';

/** Autocomplete options example */
const options: AutocompleteOptions[] = [
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
        label: 'bê two',
      },
    ],
  },
  {
    label: 'C',
  },
];

export default {
  title: 'Autocomplete',
  component: AutocompleteComponent,
  argTypes: {
    required: {
      control: 'boolean',
    },
    options: {
      control: 'array',
    },
  },
  decorators: [
    moduleMetadata({
      imports: [AutocompleteModule],
    }),
  ],
} as Meta<AutocompleteComponent>;

/** Primary autocomplete story */
export const Default: StoryObj<AutocompleteComponent> = {
  args: {
    required: true,
    options,
  },
};
