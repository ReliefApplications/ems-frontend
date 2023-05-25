import { Injectable } from '@angular/core';
import { SafeConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

/** Interface of confirm dialog data */
interface ConfirmDialogData {
  title?: string;
  content?: string;
  confirmText?: string;
  confirmColor?: string;
}

/**
 * Confirmation modal service.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeConfirmService {
  /**
   * Confirmation modal service
   *
   * @param dialog Material dialog
   */
  constructor(private dialog: Dialog) {}

  /**
   * Open confirmation modal.
   *
   * @param data dialog data
   * @returns confirmation modal dialog ref
   */
  openConfirmModal(
    data?: ConfirmDialogData
  ): DialogRef<SafeConfirmModalComponent> {
    return this.dialog.open(SafeConfirmModalComponent, { data }) as any;
  }
}
