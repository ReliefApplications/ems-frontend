import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogModule } from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';
import { TableModule } from '@oort-front/ui';
import { IconModule } from '@oort-front/ui';
import { ValidationError } from '../../../../models/record.model';

/** Model for the dialog data */
export interface ErrorsModalData {
  incrementalId: string;
  errors: ValidationError[];
  /** Title of the modal. Defaults to the validation failure of the record. */
  title?: string;
  /** Text displayed above the errors. */
  subtitle?: string;
  /** Text displayed below the errors. Empty to hide it. */
  help?: string;
  /** Header of the first column. Defaults to 'field'. */
  questionHeader?: string;
  /** Label of the confirm button. Defaults to 'update'. */
  confirmText?: string;
  /** Hides the confirm button, when there is nothing to do but close. */
  hideConfirm?: boolean;
  /** Whether the modal reports errors ( default ) or only warnings. */
  severity?: 'error' | 'warning';
}

/** Component for the errors modal component */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    TableModule,
    IconModule,
  ],
  selector: 'shared-errors-modal',
  templateUrl: './errors-modal.component.html',
  styleUrls: ['./errors-modal.component.scss'],
})
export class ErrorsModalComponent {
  /** Displayed columns */
  public displayedColumns = ['question', 'errors'];

  /**
   * Constructor of the errors modal component
   *
   * @param dialogRef The reference of the dialog
   * @param data The data for the dialog
   */
  constructor(
    public dialogRef: DialogRef<ErrorsModalComponent>,
    @Inject(DIALOG_DATA) public data: ErrorsModalData
  ) {}
}
