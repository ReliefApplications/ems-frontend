import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { DialogSize } from './enums/dialog-size.enum';
import { Variant } from '../shared/variant.enum';

/**
 * Dialog component.
 */
@Component({
  selector: 'ui-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnChanges, OnInit {
  @Input() closable = false;
  @Input() padding = true;
  @Input() size: DialogSize | string = '';

  public buttonVariant = Variant;

  /** Close material dialog. */
  @Input() onClose = () => {
    this.dialogRef.close();
  };

  /**
   * Constructor for the modal component
   *
   * @param dialogRef Used to access the dialog properties
   */
  constructor(public dialogRef: DialogRef) {}

  ngOnInit(): void {
    switch (this.size) {
      case DialogSize.FULLSCREEN: {
        this.dialogRef.addPanelClass('fullscreen-dialog');
        break;
      }
      case DialogSize.SMALL: {
        this.dialogRef.updateSize('300px');
        break;
      }
      case DialogSize.MEDIUM: {
        this.dialogRef.updateSize('700px');
        break;
      }
      case DialogSize.BIG: {
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
      case DialogSize.FULLSCREEN: {
        this.dialogRef.addPanelClass('fullscreen-dialog');
        break;
      }
      case DialogSize.SMALL: {
        this.dialogRef.updateSize('300px');
        break;
      }
      case DialogSize.MEDIUM: {
        this.dialogRef.updateSize('700px');
        break;
      }
      case DialogSize.BIG: {
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
