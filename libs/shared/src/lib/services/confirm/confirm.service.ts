import { Injectable } from '@angular/core';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Variant } from '@oort-front/ui';

/** Interface of confirm dialog data */
interface ConfirmDialogData {
  title?: string;
  content?: string;
  confirmText?: string;
  confirmVariant?: Variant;
}

/**
 * Confirmation modal service.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  /**
   * Confirmation modal service
   *
   * @param dialog Dialog
   */
  constructor(private dialog: Dialog) {}

  /**
   * Open confirmation modal.
   *
   * @param data dialog data
   * @returns confirmation modal dialog ref
   */
  openConfirmModal(data?: ConfirmDialogData): DialogRef<ConfirmModalComponent> {
    return this.dialog.open(ConfirmModalComponent, { data }) as any;
  }
}
