import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';

/**
 * Main tab of widget grid configuration modal.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent {
  /** Widget form group */
  @Input() formGroup!: UntypedFormGroup;
  /** Selected resource */
  @Input() resource: Resource | null = null;
  /** Available resource templates */
  @Input() templates: Form[] = [];
  /** Loading status */
  @Input() loading = false;

  /**
   * Reset given form field value if there is a value previously to avoid triggering
   * not necessary actions
   *
   * @param formField Current form field
   * @param event click event
   */
  clearFormField(formField: string, event: Event) {
    if (this.formGroup.get(formField)?.value) {
      this.formGroup.get(formField)?.setValue(null);
    }
    event.stopPropagation();
  }
}
