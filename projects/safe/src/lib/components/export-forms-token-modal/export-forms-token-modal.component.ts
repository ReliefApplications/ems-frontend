import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { SafeDownloadService } from '../../services/download.service';
import { element } from 'protractor';

@Component({
  selector: 'safe-export-forms-token-modal',
  templateUrl: './export-forms-token-modal.component.html',
  styleUrls: ['./export-forms-token-modal.component.css']
})
export class ExportFormsTokenModalComponent implements OnInit {

  public link: string;
  public doneButton: boolean;
  public spinnerDisplay: boolean;
  public cardDisplay: boolean;

  constructor(public dialogRef: MatDialogRef<ExportFormsTokenModalComponent>,
              private downloadService: SafeDownloadService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.link = '';
    this.doneButton = false;
    this.spinnerDisplay = false;
    this.cardDisplay = false;
  }

  ngOnInit(): void {
  }

  async exportForm(accessToken: string): Promise<void> {
    // return this.dialogRef.close(accessToken);

    this.doneButton = true;
    // this.spinnerDisplay = true;

    this.cardDisplay = true;

    this.link = '$$$$$ url $$$$$';

    // if (accessToken !== undefined) {
    //   this.doneButton = true;
    //   this.spinnerDisplay = true;
    //
    //   const path = `upload/form/kobo/${this.data.elt.id}`;
    //   const dataReturn = await this.downloadService.exportFormGetLink(path, { aToken: accessToken });
    //
    //   this.cardDisplay = true;
    //
    //   this.link = dataReturn.url;
    //   this.data.src = dataReturn.src;
    //
    //   console.log('3');
    //   this.spinnerDisplay = false;
    //
    //   console.log(this.link);
    // }
  }

  copyLinkToClipboard(): void {
    const input = document.body.appendChild(document.createElement('input'));
    input.value = this.link;
    input.focus();
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
}
