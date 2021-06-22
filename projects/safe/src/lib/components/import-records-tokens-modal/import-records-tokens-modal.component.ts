import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'safe-import-records-tokens-modal',
  templateUrl: './import-records-tokens-modal.component.html',
  styleUrls: ['./import-records-tokens-modal.component.css']
})
export class ImportRecordsTokensModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ImportRecordsTokensModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.data = {};
  }

  importRecords(accesToken: string, formId: string): void {
    this.data.accessToken = accesToken;
    this.data.formId = formId;
    return this.dialogRef.close(this.data);
  }
}
