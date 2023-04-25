import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AutocompleteOptions } from './interfaces/autocomplete-options.interface';

/**
 * UI Autocomplete component
 */
@Component({
  selector: 'ui-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements AfterViewInit {
  @Input() placeholder = '';
  @Input() required = false;
  @Input() options!: AutocompleteOptions[];

  @Output() opened: EventEmitter<boolean> = new EventEmitter();
  @Output() closed: EventEmitter<boolean> = new EventEmitter();
  @Output() selectOption: EventEmitter<AutocompleteOptions> =
    new EventEmitter();

  public open = false;
  public optionSelected: AutocompleteOptions = { label: '' };

  ngAfterViewInit(): void {
    console.log(this.options);
    document.addEventListener('click', (event: any) => {
      console.log('target', event?.target);
      console.log('event ', event);
      if (document.getElementById('autocomplete')?.contains(event?.target)) {
        console.log('--> IF');
      } else {
        console.log('--> else');
      }
    });
  }

  /**
   * Handles the selection of a option
   *
   * @param value selected option
   */
  public onSelect(value: AutocompleteOptions): void {
    console.log('onSelect', value);
    value.selected = true;
    if (this.optionSelected) this.optionSelected.selected = false;
    this.optionSelected = value;
    this.open = false;
    this.closed.emit(true);
    // console.log(this.options)
    this.selectOption.emit(value);
  }

  onClick(e: any): void {
    if (!this.open) {
      this.open = true;
      this.opened.emit(true);
    }
    // else {
    //   this.open = false;
    //   this.closed.emit(true);
    // }
    // console.log('onKey:', e, this.open)
  }
}
