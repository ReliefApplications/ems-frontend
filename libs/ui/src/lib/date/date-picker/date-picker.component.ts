import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

/**
 * UI Datepicker component
 */
@Component({
  selector: 'ui-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['../date.scss'],
})
export class DatePickerComponent {
  @Input() disabled = false;
  @Output() selectedValue = new EventEmitter<Date>();

  value!: Date;
  showPanel = false;
  isBottom = false;

  /**
   * Propagate host element blur event
   */
  @HostListener('focusout')
  onFocusout() {
    this.showPanel = false;
  }

  /**
   * Handles the selection of a content
   *
   * @param value selected date
   */
  public handleChange(value: Date) {
    this.value = value;
    this.selectedValue.emit(value);
  }
}
