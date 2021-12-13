import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Record} from '../../models/record.model';

interface DialogData {
  record: Record;
  revert: any;
}

@Component({
  selector: 'safe-history-modal',
  templateUrl: './record-history-modal.component.html',
  styleUrls: ['./record-history-modal.component.css']
})
export class RecordHistoryModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RecordHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {}

  closeModal(e: any): void {
    if (e) {
      this.dialogRef.close();
    }
  }
}
