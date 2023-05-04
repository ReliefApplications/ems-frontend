import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DialogSize } from './enums/dialog-size.enum';

export interface DialogData {
  animal: string;
  size: DialogSize;
}

@Component({
  selector: 'ui-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(
    public dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  dialogSize = DialogSize;
}
