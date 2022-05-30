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
  public title: string;
  public content: string;
  public cancelText: string;
  public confirmText: string;
  public confirmColor: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private translate: TranslateService
  ) {
    this.title =
      data.title || this.translate.instant('components.confirmModal.title');
    this.cancelText =
      data.cancelText ||
      this.translate.instant('components.confirmModal.cancel');
    this.confirmText =
      data.confirmText ||
      this.translate.instant('components.confirmModal.confirm');
    this.content = data.content || '';
    this.confirmColor = data.confirmColor || 'primary';
  }

  ngOnInit(): void {}
}
