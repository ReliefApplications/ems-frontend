import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Composite sort row.
 */
@Component({
  selector: 'shared-sort-row',
  templateUrl: './sort-row.component.html',
  styleUrls: ['./sort-row.component.scss'],
})
export class SortRowComponent {
  /** Sort form group */
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  /** Available fields */
  @Input() fields: any[] = [];
  /** Show limit control, to limit the number of items to query */
  @Input() showLimit = false;

  /** Delete event */
  @Output() delete = new EventEmitter();
}
