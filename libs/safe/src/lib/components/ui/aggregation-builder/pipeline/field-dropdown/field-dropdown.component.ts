import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * Fields dropdown component.
 */
@Component({
  selector: 'safe-field-dropdown',
  templateUrl: './field-dropdown.component.html',
  styleUrls: ['./field-dropdown.component.scss'],
})
export class SafeFieldDropdownComponent {
  @Input() fieldControl!: FormControl;
  @Input() fields: any[] = [];
  @Input() label = '';
  @Input() nullable = false;
}
