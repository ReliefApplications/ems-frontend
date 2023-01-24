import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
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
   * @param translate Angular translate service
   */
  constructor(
    public snackBar: SafeSnackBarService,
    private clipboard: Clipboard,
    public dialogRef: MatDialogRef<ShareUrlComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      url: string;
    },
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  /**
   * Copies in clipboard the displayed value.
   */
  onCopy(): void {
    this.clipboard.copy(this.data.url);
    this.snackBar.openSnackBar(
      this.translate.instant('common.notifications.copiedToClipboard')
    );
    this.dialogRef.close();
  }
}
