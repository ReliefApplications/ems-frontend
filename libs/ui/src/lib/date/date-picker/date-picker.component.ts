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
 */
@Component({
  selector: 'ui-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['../date.scss'],
})
export class DatePickerComponent {
  @Input() disabled = false;
  @Output() selectedValue = new EventEmitter<Date>();
  @ViewChild(TemplateRef) calendar!: TemplateRef<any>;

  value!: Date;

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
