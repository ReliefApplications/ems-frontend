import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Record } from '../../models/record.model';

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
  selector: 'safe-history-modal',
  templateUrl: './record-history-modal.component.html',
  styleUrls: ['./record-history-modal.component.css'],
})
export class RecordHistoryModalComponent implements OnInit {
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

  ngOnInit(): void {}

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
