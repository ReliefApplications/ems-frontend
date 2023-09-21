import { Component, Input } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

/**
 * Fields dropdown component.
 */
@Component({
  selector: 'shared-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss'],
})
export class FieldDropdownComponent {
  @Input() fieldControl!: UntypedFormControl;
  @Input() fields: any[] = [];
  @Input() label = '';
  @Input() nullable = false;
}
