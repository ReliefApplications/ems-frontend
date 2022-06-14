import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

/**
 *
 */
@Component({
  selector: 'safe-card-creation-modal',
  templateUrl: './card-creation-modal.component.html',
  styleUrls: ['./card-creation-modal.component.scss'],
})
export class SafeCardCreationModalComponent implements OnInit {
  public data: any = {
    isDynamic: false,
  };

  /**
   * @param dialogRef
   * @param formBuilder
   */
  constructor(
    public dialogRef: MatDialogRef<SafeCardCreationModalComponent>,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

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
    this.dialogRef.close(this.data);
  }

  /**
   * @param event
   */
  radioChange(event: any): void {
    this.data.isDynamic = event.value;
  }
}
