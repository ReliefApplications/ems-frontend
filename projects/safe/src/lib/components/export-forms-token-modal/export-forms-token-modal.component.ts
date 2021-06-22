import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'safe-export-forms-token-modal',
  templateUrl: './export-forms-token-modal.component.html',
  styleUrls: ['./export-forms-token-modal.component.css']
})
export class ExportFormsTokenModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ExportFormsTokenModalComponent>,
              @Inject(MAT_DIALOG_DATA) public accessToken: any) {
  }

  ngOnInit(): void {
    this.accessToken = '';
  }

  exportForm(accesToken: string): void {
    this.accessToken = accesToken;
    return this.dialogRef.close(this.accessToken);
  }
}
