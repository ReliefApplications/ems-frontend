import { Component, ContentChild, AfterContentInit, Input    } from '@angular/core';
import { AutocompleteDirective } from './autocomplete.directive';

@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements AfterContentInit {
  @ContentChild(AutocompleteDirective) uiAutocomplete!: AutocompleteDirective;
  @Input() contentKey!: string;
  @Input() options: any[] = [];

  public panelOpened = true;
  public filteredOptions: any[] = [];
  @Input() displayKey!: string;
  @Input() childrenKey!: string;
  public selectedOption!: string;

  ngAfterContentInit() {
    this.filteredOptions = this.options;
    console.log('uiAutocomplete: ', this.uiAutocomplete); //doesn't work, i can't get the directive
    if (this.uiAutocomplete) {
      this.uiAutocomplete.optionSelected.subscribe((op: any) => {
        console.log('Get selected option directive:', op);
      });
    }
  }

  onSelect(option: any): void {
    this.selectedOption = option[this.displayKey];
  }
}
