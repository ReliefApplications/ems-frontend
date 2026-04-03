import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Composite filter component.
 */
@Component({
  selector: 'shared-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent {
  /** Form group */
  @Input() form!: UntypedFormGroup;
  /** List of fields */
  @Input() fields: any[] = [];
  /** Is disabled */
  @Input() disabled = false;
  /** Can use context variables */
  @Input() canUseContext = false;
  /** Email Notification Check */
  @Input() isEmailNotification = false;
  /** Enables attribute filters to switch between field and literal values */
  @Input() enableAttributeValueSource = false;
  /** Is from widget */
  @Input() dlContextSettings: any;
}
