import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ModalSize } from './modal-size.enum';
import { Variant, Category } from '@oort-front/ui';

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
  @Input() padding = true;
  @Input() size: ModalSize | string = '';

  // === UI VARIANT AND CATEGORY ===
  public variant = Variant;
  public category = Category;

  /**
   * Close material dialog.
   */
  @Input() onClose = () => {
    this.dialogRef.close();
  };

  /**
   * Constructor for the modal component
   *
   * @param dialogRef Used to access the dialog properties
   */
  constructor(private dialogRef: MatDialogRef<SafeModalComponent>) {}

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
}
