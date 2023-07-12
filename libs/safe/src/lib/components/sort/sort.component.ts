import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Composite sort component.
 */
@Component({
  selector: 'safe-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
})
export class SafeSortComponent {
  @Input() form!: UntypedFormGroup;
  @Input() fields: any[] = [];
  @Input() showLimit = false;
}
