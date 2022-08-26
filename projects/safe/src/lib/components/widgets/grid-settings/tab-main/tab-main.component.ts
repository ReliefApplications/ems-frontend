import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';

/**
 * Main tab of widget grid configuration modal.
 */
@Component({
  selector: 'safe-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent {
  @Input() formGroup!: FormGroup;
  @Input() form: Form | null = null;
  @Input() resource: Resource | null = null;
  @Input() queries: any[] = [];
  @Input() templates: Form[] = [];
}
