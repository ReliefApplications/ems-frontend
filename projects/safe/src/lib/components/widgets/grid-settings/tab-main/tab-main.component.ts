import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
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
  @Input() forms$!: Observable<any[]>;
  @Input() sourceControl!: AbstractControl;
}
