import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Component that handles sorting
 */
@Component({
  selector: 'safe-tab-sort',
  templateUrl: './tab-sort.component.html',
  styleUrls: ['./tab-sort.component.scss'],
})
export class SafeTabSortComponent {
  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: any[] = [];
  @Input() showLimit = false;
}
