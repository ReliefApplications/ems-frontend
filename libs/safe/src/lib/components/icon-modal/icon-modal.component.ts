import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

/**
 * Modal allowing the user to select an icon
 */
@Component({
  selector: 'safe-icon-modal',
  templateUrl: './icon-modal.component.html',
  styleUrls: ['./icon-modal.component.scss'],
})
export class IconModalComponent {
  public iconForm: FormGroup = this.fb.group({
    icon: ['home', Validators.required],
  });

  /**
   * Icon modal component
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<IconModalComponent>
  ) {}

  /**
   * Close the modal without sending any data.
   */
  public onClose() {
    this.dialogRef.close();
  }
}
