import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';
import get from 'lodash/get';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeModalModule } from '../ui/modal/modal.module';
import { ButtonModule, Variant, Category } from '@oort-front/ui';

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
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    SafeModalModule,
    ButtonModule,
  ],
  selector: 'safe-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class SafeConfirmModalComponent {
  public title: string;
  public content: string;
  public cancelText: string;
  public confirmText: string;
  public confirmColor: string;

  // === BUTTON ===
  public btnVariant = Variant;
  public btnCategory = Category;

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
    this.confirmColor = get(data, 'confirmColor', 'primary');
  }
}
