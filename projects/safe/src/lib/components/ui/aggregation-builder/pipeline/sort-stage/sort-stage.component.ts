import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Component that handles sorting
 */
@Component({
  selector: 'safe-sort-stage',
  templateUrl: './sort-stage.component.html',
  styleUrls: ['./sort-stage.component.scss'],
})
export class SafeSortStageComponent {
  @Input() form: FormGroup = new FormGroup({});
  @Input() fields: any[] = [];
  @Input() showLimit = false;
}
