import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ModalSize } from './modal-size.enum';
import { TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../../../services/confirm/confirm.service';

/**
 * Modal component, used as a generic wrapper for all modals
 */
@Component({
  selector: 'safe-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class SafeModalComponent implements OnInit, OnChanges {
  @Input() closable = false;
  @Input() confirmClose = false;
  @Input() padding = true;
  @Input() size: ModalSize | string = '';

  /**
   * Constructor for the modal component
   *
   * @param dialogRef Used to access the dialog properties
   * @param confirmService Shared confirm service
   * @param translate Angular translate module
   */
  constructor(
    private dialogRef: MatDialogRef<SafeModalComponent>,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    switch (this.size) {
      case ModalSize.FULLSCREEN: {
        this.dialogRef.addPanelClass('fullscreen-dialog');
        break;
      }
      case ModalSize.SMALL: {
        this.dialogRef.updateSize('300px');
        break;
      }
      case ModalSize.MEDIUM: {
        this.dialogRef.updateSize('700px');
        break;
      }
      case ModalSize.BIG: {
        this.dialogRef.updateSize('100vw', '98%');
        break;
      }
      default: {
        this.dialogRef.removePanelClass('fullscreen-dialog');
        break;
      }
    }

    if (!this.padding) {
      this.dialogRef.addPanelClass('no-padding-dialog');
    }
  }

  ngOnChanges(): void {
    switch (this.size) {
      case ModalSize.FULLSCREEN: {
        this.dialogRef.addPanelClass('fullscreen-dialog');
        break;
      }
      case ModalSize.SMALL: {
        this.dialogRef.updateSize('300px');
        break;
      }
      case ModalSize.MEDIUM: {
        this.dialogRef.updateSize('700px');
        break;
      }
      case ModalSize.BIG: {
        this.dialogRef.updateSize('100vw', '98%');
        break;
      }
      default: {
        this.dialogRef.removePanelClass('fullscreen-dialog');
        break;
      }
    }

    if (!this.padding) {
      this.dialogRef.addPanelClass('no-padding-dialog');
    }
  }

  /**
   * When clicking the close button ask the user if indeed, it's what it wants to do
   */
  public onClose(): void {
    if (this.confirmClose) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.close'),
        content: this.translate.instant('components.confirmModal.confirmClose'),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmColor: 'warn',
      });
      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }
}
