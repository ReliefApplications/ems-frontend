import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { SelectionRange } from '@progress/kendo-angular-dateinputs';

/**
 * UI Daterange component
 * Daterange is a UI component that allows the user to select a date from a calendar or enter it manually.
 */
@Component({
  selector: 'ui-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['../date.scss'],
})
export class DateRangeComponent {
  /** Boolean indicating whether the component is disabled. */
  @Input() disabled = false;
  /** Event emitter for the selected date range. */
  @Output() selectedValue = new EventEmitter<SelectionRange>();
  /** Reference to the calendar template. */
  @ViewChild(TemplateRef) calendar!: TemplateRef<any>;
  /** The currently selected date range. */
  range: SelectionRange = {
    start: null,
    end: null,
  } as unknown as SelectionRange;
  /* Boolean indicating whether a view change action has occurred. */
  viewChangeAction = false;

  /**
   * Handles the selection of a content
   *
   * @param event SelectionRange
   */
  public onChange(event: SelectionRange) {
    this.viewChangeAction = false;
    this.range = event as any;
    this.selectedValue.emit(this.range);
  }
}
