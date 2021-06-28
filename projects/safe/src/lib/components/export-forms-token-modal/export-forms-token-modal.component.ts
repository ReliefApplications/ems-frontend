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

  constructor(public dialogRef: MatDialogRef<ExportFormsTokenModalComponent>,
              private downloadService: SafeDownloadService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.link = 'url';
    this.doneButton = false;
    this.spinnerDisplay = false;
  }

  ngOnInit(): void {
  }

  async exportForm(accessToken: string): Promise<void> {
    // return this.dialogRef.close(accessToken);


    if (accessToken !== undefined) {
      this.doneButton = true;
      this.spinnerDisplay = true;
      // document.getElementById('spinner-loading').style.display = 'block';

      // document.getElementById('spinner-loading').remove()
      // document.getElementById('spinner-loading').setAttribute('style','display: block;');
      const path = `upload/form/kobo/${this.data.elt.id}`;
      const dataReturn = await this.downloadService.exportFormGetLink(path, { aToken: accessToken });

      this.link = dataReturn.url;
      this.data.src = dataReturn.src;

      console.log('3');
      this.spinnerDisplay = false;

      console.log(this.link);
      // console.log('this.data.elt.koboUrl.toString()');
      // console.log(this.data.elt.koboUrl);
      // this.link = this.data.elt.koboUrl;
    }


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
