import { Component, Inject } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { CommonModule } from '@angular/common';
import { SafeRecordHistoryModule } from '../record-history/record-history.module';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * This interface describes the structure of the data that will be displayed in the dialog modal
 */
interface DialogData {
  id: string;
  revert: any;
}

/**
 * This component is used to display a modal with the history of a record
 */
@Component({
  standalone: true,
  imports: [CommonModule, SafeRecordHistoryModule, SafeModalModule],
  selector: 'safe-history-modal',
  templateUrl: './record-history-modal.component.html',
  styleUrls: ['./record-history-modal.component.scss'],
})
export class RecordHistoryModalComponent {
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param dialogRef The reference of the dialog modal that will be opened
   * @param data This is the data that is passed into the modal when it is
   * opened.
   * @param dialog This is the Material service that allows us to open a dialog.
   */
  constructor(
    public dialogRef: MatDialogRef<RecordHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog
  ) {}

  /**
   * Closes the modal on event
   *
   * @param e The event
   */
  closeModal(e: any): void {
    if (e) {
      this.dialogRef.close();
    }
  }
}
