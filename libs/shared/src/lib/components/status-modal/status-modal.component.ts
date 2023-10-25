import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { SpinnerModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';

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
  standalone: true,
  imports: [CommonModule, DialogModule, SpinnerModule],
  selector: 'shared-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.scss'],
})
export class StatusModalComponent {
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dialogRef The reference of the dialog that will be opened.
   * @param data This is the data that is passed into the dialog.
   */
  constructor(
    private dialogRef: DialogRef<StatusModalComponent>,
    @Inject(DIALOG_DATA) public data: StatusDialogData
  ) {}
}
