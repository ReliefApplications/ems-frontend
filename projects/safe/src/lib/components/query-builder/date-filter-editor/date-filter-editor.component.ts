import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { isDate } from 'lodash';

/**
 * Template of custom date edition, for filtering.
 */
@Component({
  selector: 'safe-date-filter-editor',
  templateUrl: './date-filter-editor.component.html',
  styleUrls: ['./date-filter-editor.component.scss'],
})
export class DateFilterEditorComponent implements OnInit {
  @Input() control!: FormControl;
  public useExpression = false;

  /** @returns Is the first input a date or not. */
  get isDate(): boolean {
    const value = this.control.value;
    const dateValue = new Date(value);
    if (
      isDate(value) ||
      (isDate(dateValue) && dateValue.toISOString() === value)
    ) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit(): void {
    this.useExpression = !this.isDate;
  }

  /**
   * Update type of editor.
   */
  public changeEditor(): void {
    this.control.setValue(null);
    this.useExpression = !this.useExpression;
  }
}
