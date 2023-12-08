import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Sorting definition of query builder component.
 */
@Component({
  selector: 'shared-tab-sort',
  templateUrl: './tab-sort.component.html',
  styleUrls: ['./tab-sort.component.scss'],
})
export class TabSortComponent {
  /** Sort form group */
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  /** Available fields */
  @Input() fields: any[] = [];
  /** Show limit control, to limit the number of items to query */
  @Input() showLimit = false;
}
