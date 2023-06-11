import { Component, Inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslateService } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';

/** Component to display current url and copy it. */
@Component({
  selector: 'app-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.css'],
})
export class ShareUrlComponent {
  /**
   * Component to display current url and copy it.
   *
   * @param snackBar Shared snackbar service
   * @param clipboard Angular clipboard service
   * @param dialogRef Dialog ref
   * @param data Injected dialog data
   * @param data.url active url
   * @param translate Angular translate service
   */
  constructor(
    public snackBar: SnackbarService,
    private clipboard: Clipboard,
    public dialogRef: DialogRef<ShareUrlComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      url: string;
    },
    private translate: TranslateService
  ) {}

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
