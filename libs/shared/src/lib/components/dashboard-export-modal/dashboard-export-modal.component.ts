import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  ToggleModule,
  FormWrapperModule,
  SelectMenuModule,
  DialogModule,
} from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** Dialog data interface */
type DialogInputI = {
  exportType: 'image' | 'pdf';
};

/** Dialog result interface */
type DialogResultI = {
  includeHeaderFooter: boolean;
} & (
  | {
      type: 'image';
      format: string;
    }
  | {
      type: 'pdf';
      paperSize: string;
    }
);

/** Component for export options modal */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    ToggleModule,
    TranslateModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    DialogModule,
  ],
  selector: 'app-dashboard-export-modal',
  templateUrl: './dashboard-export-modal.component.html',
  styleUrls: ['./dashboard-export-modal.component.scss'],
})
export class DashboardExportModalComponent {
  /** Reactive form */
  public form!: ReturnType<typeof this.getExportForm>;
  /** Dialog data */
  public data: DialogInputI;
  /** Supported image formats */
  public imageFormats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
  ];
  /** Supported paper sizes */
  public paperSizes = [{ value: 'auto', label: 'Auto' }];

  /**
   * Component for export options modal
   *
   * @param dialogData - The data for the dialog (takes in export type [PNG or PDF]).
   * @param dialogRef - A reference to the dialog in dashboard class.
   */
  constructor(
    @Inject(DIALOG_DATA) public dialogData: DialogInputI,
    public dialogRef: DialogRef<DialogResultI, DashboardExportModalComponent>
  ) {
    this.data = dialogData;
    this.form = this.getExportForm();
  }

  /**
   * Creates export form based on the export type.
   *
   * @returns the export form
   */
  private getExportForm() {
    return new FormGroup(
      Object.assign(
        {
          // Common field for both export types
          type: new FormControl(this.data.exportType),
          includeHeaderFooter: new FormControl(false),
        },
        this.data.exportType === 'image'
          ? {
              // Image export fields
              format: new FormControl(this.imageFormats[0].value),
            }
          : {
              // PDF export fields
              paperSize: new FormControl(this.paperSizes[0].value),
            }
      )
    );
  }

  /** Confirms the download and closes the dialog */
  confirmDownload(): void {
    this.dialogRef.close(this.form.value as Required<DialogResultI>);
  }
}
