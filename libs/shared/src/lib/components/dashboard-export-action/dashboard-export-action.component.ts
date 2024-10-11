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

/** Export file types */
type ExportFiles = 'image' | 'pdf';

/** Selected file configuration to export */
type ExportFileConfigurations = {
  includeHeaderFooter: boolean;
  type: ExportFiles;
} & (
  | {
      format: string;
    }
  | {
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
  selector: 'app-dashboard-export-action',
  templateUrl: './dashboard-export-action.component.html',
  styleUrls: ['./dashboard-export-action.component.scss'],
})
export class DashboardExportActionComponent {
  /** Reactive form */
  public form!: ReturnType<typeof this.getExportForm>;
  /** Dialog data */
  public exportType: ExportFiles;
  /** Supported image formats */
  public imageFormats = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
  ] as const;
  /** Supported paper sizes */
  public paperSizes = [{ value: 'auto', label: 'Auto' }] as const;

  /**
   * Component for export options modal
   *
   * @param dialogData - The data for the dialog (takes in export type [PNG or PDF]).
   * @param dialogData.exportType [PNG or PDF]
   * @param dialogRef - A reference to the dialog in dashboard class.
   */
  constructor(
    @Inject(DIALOG_DATA) public dialogData: { exportType: ExportFiles },
    public dialogRef: DialogRef<
      ExportFileConfigurations,
      DashboardExportActionComponent
    >
  ) {
    this.exportType = dialogData?.exportType;
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
          type: new FormControl(this.exportType),
          includeHeaderFooter: new FormControl(false),
        },
        this.exportType === 'image'
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
    this.dialogRef.close(this.form.value as Required<ExportFileConfigurations>);
  }
}
