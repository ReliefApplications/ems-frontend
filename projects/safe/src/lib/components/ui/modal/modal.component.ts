import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalSize } from './modal-size.enum';

/**
 * Modal component, used as a generic wrapper for all modals
 */
@Component({
  selector: 'safe-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class SafeModalComponent implements OnInit {
  @Input() closable = false;
  @Input() padding = true;
  @Input() size: ModalSize | string = '';
  /**
   * Set the size of the modal.
   */
  // @Input() set size(value: string) {
  //   switch (value) {
  //     case ModalSize.FULLSCREEN: {
  //       this.dialogRef.addPanelClass('fullscreen-dialog');
  //       break;
  //     }
  //     case ModalSize.SMALL: {
  //       this.dialogRef.removePanelClass('fullscreen-dialog');
  //       this.dialogRef.updateSize('300px');
  //       break;
  //     }
  //     case ModalSize.MEDIUM: {
  //       this.dialogRef.removePanelClass('fullscreen-dialog');
  //       this.dialogRef.updateSize('700px');
  //       break;
  //     }
  //     case ModalSize.BIG: {
  //       this.dialogRef.removePanelClass('fullscreen-dialog');
  //       this.dialogRef.updateSize('100vw', '98%');
  //       break;
  //     }
  //     default: {
  //       this.dialogRef.removePanelClass('fullscreen-dialog');
  //       break;
  //     }
  //   }
  // }

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
}
