import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { SafeSnackBarService } from '@safe/builder';
import { TranslateService } from '@ngx-translate/core';

/** Component to display current url and copy it. */
@Component({
  selector: 'app-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.css'],
})
export class ShareUrlComponent implements OnInit {
  /**
   * Component to display current url and copy it.
   *
   * @param snackBar Shared snackbar service
   * @param clipboard Angular clipboard service
   * @param dialogRef Material dialog ref
   * @param data Injected dialog data
   * @param data.url active url
   */
  constructor(
    public snackBar: SafeSnackBarService,
    private clipboard: Clipboard,
    public dialogRef: MatDialogRef<ShareUrlComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      url: string;
    },
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  /**
   * Copies in clipboard the displayed value.
   */
  onCopy(): void {
    this.clipboard.copy(this.data.url);
    this.snackBar.openSnackBar(
      this.translateService.instant('common.notifications.copiedToClipboard')
    );
    this.dialogRef.close();
  }
}
