import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';

/**
 * UI Datepicker component
 * Datepicker is a UI component that allows the user to select a date from a calendar or enter it manually.
 */
@Component({
  selector: 'ui-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['../date.scss'],
})
export class DatePickerComponent {
  /** Boolean indicating whether the component is disabled. */
  @Input() disabled = false;
  /** Event emitter for the selected date. */
  @Output() selectedValue = new EventEmitter<Date>();
  /** Reference to the calendar template. */
  @ViewChild(TemplateRef) calendar!: TemplateRef<any>;
  /** The currently selected date. */
  value!: Date;
  /** Boolean indicating whether a view change action has occurred. */
  viewChangeAction = false;

  /**
   * Handles the selection of a content
   *
   * @param value selected date
   */
  public handleChange(value: Date) {
    this.viewChangeAction = false;
    this.value = value;
    this.selectedValue.emit(value);
  }
}
