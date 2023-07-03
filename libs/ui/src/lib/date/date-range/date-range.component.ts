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
 */
@Component({
  selector: 'ui-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['../date.scss'],
})
export class DateRangeComponent {
  @Input() disabled = false;
  @Output() selectedValue = new EventEmitter<SelectionRange>();
  @ViewChild(TemplateRef) calendar!: TemplateRef<any>;

  range: SelectionRange = {
    start: null,
    end: null,
  } as unknown as SelectionRange;

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
