import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogModule } from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';
import { TableModule } from '@oort-front/ui';

/** Model for the dialog data */
interface DialogData {
  incrementalId: string;
  errors: {
    question: string;
    errors: string[];
  }[];
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
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}
}
