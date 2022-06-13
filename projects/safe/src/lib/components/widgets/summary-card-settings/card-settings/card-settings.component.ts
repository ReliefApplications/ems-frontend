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
 *
 */
@Component({
  selector: 'safe-card-settings',
  templateUrl: './card-settings.component.html',
  styleUrls: ['./card-settings.component.scss'],
})
export class SafeCardSettingsComponent implements OnInit {
  public form: any;

  /**
   * @param dialogRef
   * @param formBuilder
   * @param data
   */
  constructor(
    public dialogRef: MatDialogRef<SafeCardSettingsComponent>,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

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
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.form.value);
  }
}
