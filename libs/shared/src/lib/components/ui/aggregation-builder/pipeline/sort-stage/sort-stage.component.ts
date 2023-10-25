import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Component that handles sorting
 */
@Component({
  selector: 'shared-sort-stage',
  templateUrl: './sort-stage.component.html',
  styleUrls: ['./sort-stage.component.scss'],
})
export class SortStageComponent {
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() fields: any[] = [];
  @Input() showLimit = false;
}
