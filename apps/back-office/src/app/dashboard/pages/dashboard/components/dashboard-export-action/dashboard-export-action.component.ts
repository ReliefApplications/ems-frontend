import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

/**
 * Dashboard Export Button Action Component
 */
@Component({
  selector: 'app-dashboard-export-action',
  templateUrl: './dashboard-export-action.component.html',
  styleUrls: ['./dashboard-export-action.component.scss'],
})
export class DashboardExportActionComponent {
  /** Dialog Result (from forms) */
  public data: any;
  /** Image Formats */
  public imageFormats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
  ];

  /** Image Export Form*/
  exportImage = new FormGroup({
    format: new FormControl('png'),
    includeHeaderFooter: new FormControl(false),
  });

  /** PDF Export Form*/
  exportPDF = new FormGroup({
    includeHeaderFooter: new FormControl(false),
    paperSize: new FormControl('auto'),
  });

  /**
   * This is the constructor for the DashboardExportActionComponent.
   *
   * @param dialogData - The data for the dialog (takes in export type [PNG or PDF]).
   * @param dialogRef - A reference to the dialog in dashboard class.
   */
  constructor(
    @Inject(DIALOG_DATA) public dialogData: any,
    public dialogRef: DialogRef<any>
  ) {
    this.data = dialogData.data;
  }

  /**
   * Closes the dialog and returns the input values
   * from the exportImage form to the
   * dialog capture in the dashboard class.
   */
  closeImageDialog(): void {
    this.dialogRef.close(this.exportImage.value);
  }

  /**
   * Returns true if the user closes the dialog box
   */
  closeDialog(): void {
    this.dialogRef.close(true);
  }

  /**
   * Closes the dialog and returns the input values
   * from the exportImage form to the dialog capture
   * in the dashboard class.
   */
  closePDFDialog(): void {
    this.dialogRef.close(this.exportPDF.value);
  }
}
