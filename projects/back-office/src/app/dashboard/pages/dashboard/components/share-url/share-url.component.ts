import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { SafeSnackBarService, NOTIFICATIONS } from '@safe/builder';

@Component({
  selector: 'app-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.css'],
})
/** Modal content to display an url. */
export class ShareUrlComponent implements OnInit {
  constructor(
    public snackBar: SafeSnackBarService,
    private clipboard: Clipboard,
    public dialogRef: MatDialogRef<ShareUrlComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      url: string;
    }
  ) {}

  ngOnInit(): void {}

  /** Copy in clipboard the value displayed. */
  onCopy(): void {
    this.clipboard.copy(this.data.url);
    this.snackBar.openSnackBar(NOTIFICATIONS.copied);
    this.dialogRef.close();
  }
}
