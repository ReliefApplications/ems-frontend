import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'safe-import-records-tokens-modal',
  templateUrl: './import-records-tokens-modal.component.html',
  styleUrls: ['./import-records-tokens-modal.component.css']
})
export class ImportRecordsTokensModalComponent implements OnInit {

  // accessToken: string;
  // formId: string;

  constructor(public dialogRef: MatDialogRef<ImportRecordsTokensModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    // this.accessToken = 'test1';
    // this.formId = 'test2';
  }

  ngOnInit(): void {
    this.data = {};
  }

  importRecords(accesToken: string, formId: string): void {
    // console.log(this.accesToken);
    // console.log(this.formId);
    console.log(accesToken);
    console.log(formId);
    this.data.accessToken = accesToken;
    this.data.formId = formId;

    console.log(this.data);

    return this.dialogRef.close(this.data);

    // const path = `upload/records/update/${element.id}`;
    // this.downloadService.updateRecords(path);
  }
}
