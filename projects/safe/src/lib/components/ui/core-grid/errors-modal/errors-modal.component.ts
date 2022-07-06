import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selector: 'safe-errors-modal',
  templateUrl: './errors-modal.component.html',
  styleUrls: ['./errors-modal.component.scss'],
})
export class SafeErrorsModalComponent implements OnInit {
  public displayedColumns = ['question', 'errors'];

  /**
   * Constructor of the component
   *
   * @param dialogRef The reference of the dialog
   * @param data The data for the dialog
   */
  constructor(
    public dialogRef: MatDialogRef<SafeErrorsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}
}
