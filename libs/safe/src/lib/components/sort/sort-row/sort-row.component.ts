import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Composite sort row.
 */
@Component({
  selector: 'safe-sort-row',
  templateUrl: './sort-row.component.html',
  styleUrls: ['./sort-row.component.scss'],
})
export class SortRowComponent {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() fields: any[] = [];
  @Input() showLimit = false;

  @Output() delete = new EventEmitter();
}
