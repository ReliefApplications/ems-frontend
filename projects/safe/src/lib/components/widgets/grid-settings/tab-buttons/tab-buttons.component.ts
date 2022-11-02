import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { createButtonFormGroup } from '../grid-settings.forms';
import { Form } from '../../../../models/form.model';
import { Channel } from '../../../../models/channel.model';

/**
 * Buttons tab of grid widget configuration modal.
 */
@Component({
  selector: 'safe-tab-buttons',
  templateUrl: './tab-buttons.component.html',
  styleUrls: ['./tab-buttons.component.scss'],
})
export class TabButtonsComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields: any[] = [];
  @Input() relatedForms: Form[] = [];
  @Input() channels: Channel[] = [];
  @Input() templates: any[] = [];

  /** @returns List of the floating buttons */
  get buttons(): FormArray {
    return (this.formGroup?.controls.floatingButtons as FormArray) || null;
  }

  /**
   * Adds a floating button configuration.
   */
  public addButton(): void {
    const floatingButtons = this.formGroup?.get('floatingButtons') as FormArray;
    floatingButtons.push(createButtonFormGroup({ show: true }));
  }

  /**
   * Deletes a floating button configuration.
   *
   * @param index index of button to remove
   */
  public deleteButton(index: number): void {
    const floatingButtons = this.formGroup?.get('floatingButtons') as FormArray;
    floatingButtons.removeAt(index);
  }
}
