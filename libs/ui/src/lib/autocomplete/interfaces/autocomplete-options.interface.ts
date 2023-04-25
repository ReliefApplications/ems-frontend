/**
 * Autocomplete options structure
 */
export interface AutocompleteOptions {
  label: string;
  children?: AutocompleteOptions[];
  selected?: boolean;
}
