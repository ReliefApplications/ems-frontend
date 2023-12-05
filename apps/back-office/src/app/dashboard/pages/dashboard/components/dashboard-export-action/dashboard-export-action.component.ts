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
  data: any;
  scaleValue = 100;

  exportImage = new FormGroup({
    format: new FormControl('png'),
    includeHeaderFooter: new FormControl(false),
  });

  exportPDF = new FormGroup({
    includeHeaderFooter: new FormControl(false),
    orientation: new FormControl('portrait'),
    paperSize: new FormControl('a4'),
    scale: new FormControl(100),
    margin: new FormControl('minimum'),
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
    console.log(this.data.exportType);
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
   * Closes the dialog and returns the input values
   * from the exportImage form to the dialog capture
   * in the dashboard class.
   */
  closePDFDialog(): void {
    this.dialogRef.close(this.exportPDF.value);
  }
}
