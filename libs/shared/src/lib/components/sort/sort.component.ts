import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Composite sort component.
 */
@Component({
  selector: 'shared-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SharedSortComponent {
  /** Sort form group */
  @Input() form!: UntypedFormGroup;
  /** Available fields */
  @Input() fields: any[] = [];
  /** Show limit control, to limit the number of items to query */
  @Input() showLimit = false;
}
