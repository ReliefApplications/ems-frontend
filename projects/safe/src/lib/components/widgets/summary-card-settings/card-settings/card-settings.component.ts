import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 *
 */
interface DialogData {
  tileForm: any;
}

/**
 * Used for changing the settings of a card in the summary-card widget
 */
@Component({
  selector: 'safe-card-settings',
  templateUrl: './card-settings.component.html',
  styleUrls: ['./card-settings.component.scss'],
})
export class SafeCardSettingsComponent implements OnInit {
  public form: any;

  /**
   * Contructor for safe-card-settings component
   *
   * @param dialogRef
   * @param formBuilder
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<SafeCardSettingsComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /**
   * Creates a formGroup with the data provided in the modal creation
   */
  ngOnInit(): void {
    this.form = this.formBuilder.group(this.data);
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
