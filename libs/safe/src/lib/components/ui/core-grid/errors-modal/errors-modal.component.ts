import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
    MatButtonModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    TableModule,
  ],
  selector: 'safe-errors-modal',
  templateUrl: './errors-modal.component.html',
  styleUrls: ['./errors-modal.component.scss'],
})
export class SafeErrorsModalComponent {
  public displayedColumns = ['question', 'errors'];

  /**
   * Constructor of the component
   *
   * @param dialogRef The reference of the dialog
   * @param data The data for the dialog
   */
  constructor(
    public dialogRef: DialogRef<SafeErrorsModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}
}
