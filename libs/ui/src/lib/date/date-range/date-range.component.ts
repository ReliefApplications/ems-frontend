import { Component, HostListener, Input } from '@angular/core';

/**
 * UI Daterange component
 */
@Component({
  selector: 'ui-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['../date.scss'],
})
export class DateRangeComponent {
  @Input() disabled = false;
  selectedValue: any;
  showPanel = false;
  public range = {
    start: new Date(2018, 10, 10),
    end: new Date(2018, 10, 20),
  };

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
  public handleChange(value: any) {
    this.range.start = value;
    console.log(this.range);
    console.log(value);
  }

  /**
   * Set class for today date in calendar
   *
   * @param date Date
   * @returns today class
   */
  public isToday(date: Date) {
    return new Date().getDate() === date.getDate() ? 'today' : '';
  }
}
