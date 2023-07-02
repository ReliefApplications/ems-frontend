import { Component, Inject } from '@angular/core';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import get from 'lodash/get';
import { CommonModule } from '@angular/common';
import { DialogModule, Variant } from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';

/**
 * This interface describes the structure of the data to be displayed in the modal
 */
interface DialogData {
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  confirmVariant?: Variant;
}

/**
 * This component is used to make a general confirmation modal, adapting to different cases
 */
@Component({
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  selector: 'safe-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class SafeConfirmModalComponent {
  public title: string;
  public content: string;
  public cancelText: string;
  public confirmText: string;
  public confirmVariant: Variant = 'primary';

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param data The data to be displayed in the modal
   * @param translate The translating service used to translate the different texts except the content of the modal
   */
  constructor(
    @Inject(DIALOG_DATA) public data: DialogData,
    private translate: TranslateService
  ) {
    this.title = get(
      data,
      'title',
      this.translate.instant('components.confirmModal.title')
    );
    this.cancelText = get(
      data,
      'cancelText',
      this.translate.instant('components.confirmModal.cancel')
    );
    this.confirmText = get(
      data,
      'confirmText',
      this.translate.instant('components.confirmModal.confirm')
    );
    this.content = get(data, 'content', '');
    this.confirmVariant = get(data, 'confirmVariant', this.confirmVariant);
  }
}
