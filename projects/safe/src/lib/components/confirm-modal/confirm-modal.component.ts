import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

/**
 * This interface describes the structure of the data to be displayed in the modal
 */
interface DialogData {
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
}

/**
 * This component is used to make a general confirmation modal, adapting to different cases
 */
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

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param data The data to be displayed in the modal
   * @param translate The translating service used to translate the different texts except the content of the modal
   */
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
