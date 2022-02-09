import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface StatusDialogData {
  title?: string;
  content?: string;
  showSpinner?: boolean;
}

@Component({
  selector: 'safe-status-modal',
  templateUrl: './status-modal.component.html',
  styleUrls: ['./status-modal.component.css'],
})
export class SafeStatusModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<SafeStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StatusDialogData
  ) {
    if (data) {
      this.dialogRef.updateSize('200px', '90px');
      if (!data.title && !data.content) {
        this.dialogRef.addPanelClass('status-dialog');
      }
    }
  }

  ngOnInit(): void {}
}
