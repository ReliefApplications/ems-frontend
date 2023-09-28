import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Component that handles sorting
 */
@Component({
  selector: 'shared-tab-sort',
  templateUrl: './tab-sort.component.html',
  styleUrls: ['./tab-sort.component.scss'],
})
export class TabSortComponent {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() fields: any[] = [];
  @Input() showLimit = false;
}
