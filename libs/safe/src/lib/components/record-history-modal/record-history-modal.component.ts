import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordHistoryModule } from '../record-history/record-history.module';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

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
  imports: [
    CommonModule,
    SafeRecordHistoryModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
  ],
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
   * @param dialog This is the service that allows us to open a dialog.
   */
  constructor(
    public dialogRef: DialogRef<RecordHistoryModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    public dialog: Dialog
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
