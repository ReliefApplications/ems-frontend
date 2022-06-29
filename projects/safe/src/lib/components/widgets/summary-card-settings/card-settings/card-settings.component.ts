import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Material Dialog Data
 */
interface DialogData {
  tileForm: any;
}

/**
 * Card Settings component.
 * Used as a Material Dialog.
 */
@Component({
  selector: 'safe-card-settings',
  templateUrl: './card-settings.component.html',
  styleUrls: ['./card-settings.component.scss'],
})
export class SafeCardSettingsComponent implements OnInit {
  public form: any;

  /**
   * Card Settings component.
   * Used as a Material Dialog.
   *
   * @param dialogRef Material Dialog Ref of the component
   * @param fb Angular form builder
   * @param data dialog data
   */
  constructor(
    public dialogRef: MatDialogRef<SafeCardSettingsComponent>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /**
   * Creates a formGroup with the data provided in the modal creation
   */
  ngOnInit(): void {
    this.form = this.fb.group(this.data);
  }

  /**
   * Closes the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Closes the modal sending the form data.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form.value);
  }
}
