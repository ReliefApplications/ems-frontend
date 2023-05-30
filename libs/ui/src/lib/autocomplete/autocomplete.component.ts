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
 */
@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent {
  @ViewChild(TemplateRef) templateRef!: TemplateRef<any>;
  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent>;
  openPanel = false;
}
