import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() templates?: Form[];
  /** Saves if the layouts has been fetched */
  @Input() loadedLayouts = false;
  /** Emits when complete layout list should be fetched */
  @Output() loadLayouts = new EventEmitter<void>();
  /** Emits when the select template is opened for the first time */
  @Output() loadTemplates = new EventEmitter<void>();
  /** Saves if the templates has been fetched */
  public loadedTemplates = false;

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

  /**
   * On open select menu the first time, emits event to load resource templates query.
   */
  public onOpenSelectTemplates(): void {
    if (!this.loadedTemplates) {
      this.loadTemplates.emit();
      this.loadedTemplates = true;
    }
  }
}
