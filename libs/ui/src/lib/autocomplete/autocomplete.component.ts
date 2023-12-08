import {
  Component,
  ContentChildren,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { OptionComponent } from './components/option.component';

/**
 * UI Autocomplete component
 * Autocomplete is a UI component that provides suggestions while you type into the field.
 */
@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent {
  /** Reference to the component's template. */
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  /** List of OptionComponent descendants. */
  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent>;
  /** Boolean to control the visibility of the options panel. */
  openPanel = false;
}
