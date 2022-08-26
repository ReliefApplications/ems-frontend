import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Actions tab of grid widget configuration modal.
 */
@Component({
  selector: 'safe-tab-actions',
  templateUrl: './tab-actions.component.html',
  styleUrls: ['./tab-actions.component.scss'],
})
export class TabActionsComponent {
  @Input() formGroup!: FormGroup;
}
