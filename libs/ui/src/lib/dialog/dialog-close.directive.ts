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
  //uiDialogClose will be an array and will receive 2 elements
  //the first will be the data to return and the second dialogRef to close the dialog
  @Input() uiDialogClose!: any[];

  /**
   * Handles the click event callback of close dialog button
   *
   */
  @HostListener('click', ['$event']) onClose() {
    const dialogRef = this.uiDialogClose[1] as DialogRef;
    dialogRef.close(this.uiDialogClose[0]);
  }
}
