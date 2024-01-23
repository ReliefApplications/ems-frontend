import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogSize } from './types/dialog-size';
import { ResizeEvent } from 'angular-resizable-element';

/**
 * Dialog component.
 * Dialogs are modal UI overlays that provide contextual app information.
 */
@Component({
  selector: 'ui-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnChanges, OnInit {
  /** Boolean indicating whether the dialog is closable. */
  @Input() closable = false;
  /** Should display padding around dialog */
  @Input() padding = true;
  /** Size of the dialog: small - medium - big - fullscreen */
  @Input() size!: DialogSize;
  /** Boolean indicating whether the dialog is resizable. */
  @Input() resizable = false;

  /** Close Dialog. */
  @Input() onClose = () => {
    this.dialogRef.close();
  };

  /**
   * Constructor for the dialog modal component
   *
   * @param dialogRef Used to access the dialog properties
   */
  constructor(public dialogRef: DialogRef) {}

  ngOnInit(): void {
    this.setDialogType();
  }

  ngOnChanges(): void {
    this.setDialogType();
  }

  /**
   * On resize action
   *
   * @param event resize event
   */
  onResizing(event: ResizeEvent): void {
    this.dialogRef.updateSize(
      `${event.rectangle.width}px`,
      `${event.rectangle.height}px`
    );
  }

  /**
   * Set dialog type by the given size
   */
  private setDialogType() {
    switch (this.size) {
      case 'fullscreen': {
        this.dialogRef.addPanelClass('fullscreen-dialog');
        break;
      }
      case 'small': {
        this.dialogRef.updateSize('300px');
        break;
      }
      case 'medium': {
        this.dialogRef.updateSize('700px');
        break;
      }
      case 'big': {
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
