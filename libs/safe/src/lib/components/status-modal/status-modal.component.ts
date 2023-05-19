import { Component, Inject } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SpinnerModule } from '@oort-front/ui';
import { SafeModalModule } from '../ui/modal/modal.module';

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
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    SpinnerModule,
    SafeModalModule,
  ],
  selector: 'safe-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.scss'],
})
export class SafeStatusModalComponent {
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
  ) {}
}
