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
  @Input() size: ModalSize | string = ModalSize.MEDIUM;
  @Input() padding = true;

  /**
   * Constructor for the modal component
   *
   * @param dialogRef Used to access the dialog properties
   */
  constructor(private dialogRef: MatDialogRef<SafeModalComponent>) {}

  ngOnInit(): void {
    if (this.size === ModalSize.FULLSCREEN) {
      this.dialogRef.addPanelClass('fullscreen-dialog');
    } else if (this.size === ModalSize.MEDIUM) {
      this.dialogRef.updateSize('700px');
    } else if (this.size === ModalSize.SMALL) {
      this.dialogRef.updateSize('300px');
    } else if (this.size === ModalSize.BIG) {
      this.dialogRef.updateSize('100vw', '98%');
    }

    if (!this.padding) {
      this.dialogRef.addPanelClass('no-padding-dialog');
    }
  }
}
