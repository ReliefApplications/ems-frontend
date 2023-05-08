import { Component, ContentChildren, QueryList } from '@angular/core';
import { OptionComponent } from '../option/option.component';

/**
 * UI Autocomplete component
 */
@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent {
  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent>;
  openPanel = false;
}
