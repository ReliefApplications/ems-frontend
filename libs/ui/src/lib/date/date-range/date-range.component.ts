import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';

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
  @Output() selectedValue = new EventEmitter<SelectionRange>();

  private range: SelectionRange = {
    start: null,
    end: null,
  } as unknown as SelectionRange;
  showPanel = false;

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
   * @param event SelectionRange
   */
  public onChange(event: SelectionRange) {
    this.range = event as any;
    this.selectedValue.emit(this.range);
  }
}
