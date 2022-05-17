import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

interface DialogData {
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
}

@Component({
  selector: 'safe-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class SafeConfirmModalComponent implements OnInit {
  public title = this.translate.instant('common.confirm');
  public content = '';
  public cancelText = this.translate.instant('common.cancel');
  public confirmText = this.translate.instant('common.confirm');
  public confirmColor = 'primary';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService
  ) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.content) {
      this.content = data.content;
    }
    if (data.cancelText) {
      this.cancelText = data.cancelText;
    }
    if (data.confirmText) {
      this.confirmText = data.confirmText;
    }
    if (data.confirmColor) {
      this.confirmColor = data.confirmColor;
    }
  }

  ngOnInit(): void {}
}
