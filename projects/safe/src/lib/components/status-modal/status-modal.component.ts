import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

/**
 * Interface describing the structure of the data displayed in the modal
 */
interface StatusDialogData {
  title?: string;
  content?: string;
  showSpinner?: boolean;
}

/**
 * This component is used to show a modal displaying the status of a component (on save, update etc.)
 */
@Component({
  selector: 'safe-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.css'],
})
export class SafeStatusModalComponent implements OnInit {
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dialogRef The reference of the dialog that will be opened.
   * @param data This is the data that is passed into the dialog.
   */
  constructor(
    private dialogRef: MatDialogRef<SafeStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusDialogData
  ) {
    if (data) {
      this.dialogRef.updateSize('200px', '90px');
      if (!data.title && !data.content) {
        this.dialogRef.addPanelClass('status-dialog');
      }
    }
  }

  ngOnInit(): void {}
}
