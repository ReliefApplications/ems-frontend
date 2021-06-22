import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SafeDownloadService} from '../../services/download.service';
import {element} from 'protractor';

@Component({
  selector: 'safe-export-forms-token-modal',
  templateUrl: './export-forms-token-modal.component.html',
  styleUrls: ['./export-forms-token-modal.component.css']
})
export class ExportFormsTokenModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ExportFormsTokenModalComponent>,
              private downloadService: SafeDownloadService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

  exportForm(accessToken: string): void {
    return this.dialogRef.close(accessToken);
    // console.log(this.data);
    // if (accessToken !== undefined){
    //   const path = `upload/form/kobo/${this.data.elt.id}`;
    //   const url = this.downloadService.exportFormGetLink(path, {accessToken: accessToken}, this.data.elt);
    //   this.data.urlKobo = url;
    //   // this.downloadService.updateRecords(path, {accessToken: accessToken});
    //   console.log('°°° url °°°');
    //   console.log(url);
    // }
  }
}
