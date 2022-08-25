import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

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
  @Input() size = '';
  @Input() padding = true;

  /**
   * Used to acces the dialog properties
   *
   * @param dialogRef
   */
  constructor(private dialogRef: MatDialogRef<SafeModalComponent>) {}

  ngOnInit(): void {
    if (this.size === 'fullscreen') {
      this.dialogRef.addPanelClass('fullscreen-dialog');
    } else if (this.size === 'medium') {
      this.dialogRef.updateSize('700px');
    } else if (this.size === 'small') {
      this.dialogRef.updateSize('300px');
    } else if (this.size === 'big') {
      this.dialogRef.updateSize('100vw', '98%');
    }

    if (!this.padding) {
      this.dialogRef.addPanelClass('no-padding-dialog');
    }
  }
}
