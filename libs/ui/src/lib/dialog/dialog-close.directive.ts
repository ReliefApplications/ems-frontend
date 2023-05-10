import { Directive, Input, HostListener } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';

/**
 * UI Dialog close directive
 *
 * It allows to return data when close the dialog
 */
@Directive({
  selector: '[uiDialogClose]',
})
export class DialogCloseDirective {
  @Input() uiDialogClose!: any;

  /**
   * UI Dialog close constructor
   *
   * @param dialogRef DialogRef
   */
  constructor(private dialogRef: DialogRef) {}

  /**
   * Handles the click event callback of close dialog button
   *
   */
  @HostListener('click', ['$event']) onClose() {
    this.dialogRef.close(this.uiDialogClose);
  }
}
