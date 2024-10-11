import { Dialog } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { ComponentRef, ElementRef, Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { drawDOM, exportImage, exportPDF } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';
import { filter, first } from 'rxjs';
import { DashboardExportActionComponent } from '../../components/dashboard-export-action/dashboard-export-action.component';
import { MapStatusService } from '../map/map-status.service';
import { SnackbarSpinnerComponent } from '../../components/snackbar-spinner/snackbar-spinner.component';

/**
 * Exporter service to create png/pdf files from DOM element
 * Can export given element source as:
 * - PDF
 * - Image: PNG, JPG
 */
@Injectable({
  providedIn: 'root',
})
export class ExporterService {
  /**
   * Exporter service to create png/pdf files from DOM element
   *
   * @param document Document token
   * @param mapStatusService Map status service
   * @param dialog Angular CDK dialog
   * @param translate Translate service
   * @param snackBar Snackbar service
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private mapStatusService: MapStatusService,
    private dialog: Dialog,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {}

  /**
   * Check if any map component exists in the given element source
   *
   * @param elementRef Source element to export
   * @returns Map components number of items in given source element
   */
  private mapExistsInExportComponent(elementRef: ElementRef): boolean {
    const hasMaps =
      elementRef.nativeElement.querySelectorAll('shared-map')?.length;
    return hasMaps;
  }

  /**
   * Starts the spinning snackbar
   *
   * @param spinMessage Spin message for loading snackbar
   * @returns spinner ref
   */
  private startSpinSnackbar(spinMessage: string): ComponentRef<any> {
    // Create a snackbar to indicate file is processing
    return this.snackBar.openComponentSnackBar(SnackbarSpinnerComponent, {
      duration: 0,
      data: {
        message: spinMessage,
        loading: true,
      },
    });
  }

  /**
   * This method generates a PDF with the user input provided parameters.
   *
   * @param elementRef Source element to draw
   * @param fileName Pdf file name
   * @param includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param pdfSize The size of the PDF to be generated.
   * @returns {Promise<string>} A promise that resolves to a string representing the PDF data.
   */
  public async pdfDrawer(
    elementRef: ElementRef,
    fileName: string,
    includeHeaderFooter: boolean,
    pdfSize: string
  ): Promise<string> {
    if (includeHeaderFooter) {
      this.addHeaderAndFooter(elementRef, fileName);
    }

    const drawing = await drawDOM(elementRef.nativeElement, {
      paperSize: pdfSize,
    });
    const pdfData = await exportPDF(drawing);
    if (includeHeaderFooter) {
      this.removeHeaderAndFooter(elementRef);
    }
    this.mapStatusService.updateExportingStatus(false);
    return pdfData;
  }

  /**
   * Saves the dashboard as a PDF file.
   *
   * @param elementRef Source element to export
   * @param pdfName Name of the exported pdf
   */
  public async pdfExporter(
    elementRef: ElementRef,
    pdfName: string
  ): Promise<void> {
    const data = {
      exportType: 'pdf',
    };

    // if (this.mapReadyForExportSubscription) {
    //   this.mapReadyForExportSubscription.unsubscribe();
    // }

    // Open the DashboardExportActionComponent dialog
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data,
    });

    // Handle the dialog result
    dialogRef.closed.subscribe(async (result) => {
      if (result !== true && result !== undefined) {
        const resultValue = result as {
          includeHeaderFooter: boolean;
          paperSize: string;
        };
        // Sends export = true to map component when kendo export starts
        this.mapStatusService.updateExportingStatus(true);

        const snackbarRef = this.startSpinSnackbar(
          this.translate.instant('common.notifications.export.loading', {
            type: 'PDF',
          })
        );

        if (this.mapExistsInExportComponent(elementRef)) {
          this.mapStatusService.mapReadyForExport$
            .pipe(
              filter((ready) => ready === true), // Waits until map is ready
              first()
            )
            .subscribe(async () => {
              // Sets 0.5 second timeout to ensure the map layer is fully loaded
              setTimeout(async () => {
                const pdfData = await this.pdfDrawer(
                  elementRef,
                  pdfName,
                  resultValue.includeHeaderFooter,
                  resultValue.paperSize
                );
                saveAs(pdfData, `${pdfName}.pdf`);
                await this.mapStatusService.clearLoadedMaps();
              }, 500);
            });
        } else {
          // If no map exists, proceed as normal
          const pdfData = await this.pdfDrawer(
            elementRef,
            pdfName,
            resultValue.includeHeaderFooter,
            resultValue.paperSize
          );
          saveAs(pdfData, `${pdfName}.pdf`);
          await this.mapStatusService.clearLoadedMaps();
        }
        snackbarRef.instance.dismiss();
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.export.pdf'),
          { duration: 700 }
        );
      }
    });
  }

  /**
   * Adds header and footer to the top and bottom of a
   * PDF and Image export.
   *
   * @param elementRef Source element where to add header and footer
   * @param elementName Source element name
   */
  private addHeaderAndFooter(
    elementRef: ElementRef,
    elementName: string
  ): void {
    // Create header and footer elements
    const header = this.document.createElement('div');
    const footer = this.document.createElement('div');

    // Add date and time to header
    const dateTime = new Date();
    const dateTimeText =
      dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
    const pageTitle = elementName;
    header.innerHTML = `<span class="float-left">${dateTimeText}</span><span class="block text-center">${pageTitle}</span>`;

    // Add URL to footer
    const url = window.location.href;
    footer.innerHTML = `<span class="text-center">${url}</span>`;

    // Append header and footer to the dashboard
    elementRef.nativeElement.prepend(header);
    elementRef.nativeElement.append(footer);
  }

  /**
   * Removes header and footer from pdf and image export.
   *
   * @param elementRef Source element from where to remove header and footer
   */
  private removeHeaderAndFooter(elementRef: ElementRef): void {
    const header = elementRef.nativeElement.firstChild;
    const footer = elementRef.nativeElement.lastChild;
    elementRef.nativeElement.removeChild(header);
    elementRef.nativeElement.removeChild(footer);
  }

  /**
   * This function draws a PNG image from the current state of the dashboard.
   *
   * @param elementRef Source element to draw as png
   * @param fileName Png file name
   * @param includeHeaderFooter Whether to include a header and footer in the image.
   * @returns {Promise<string>} A promise that resolves to a string representing the PNG data.
   */
  public async pngDrawer(
    elementRef: ElementRef,
    fileName: string,
    includeHeaderFooter: boolean
  ): Promise<string> {
    if (includeHeaderFooter) {
      this.addHeaderAndFooter(elementRef, fileName);
    }
    const background = elementRef.nativeElement.style.color;
    elementRef.nativeElement.style.background = '#fff';
    const drawing = await drawDOM(elementRef.nativeElement, {
      margin: { top: 10, left: 10, right: 10, bottom: 10 },
    });
    elementRef.nativeElement.style.background = background;
    const pngData = await exportImage(drawing);
    if (includeHeaderFooter) {
      this.removeHeaderAndFooter(elementRef);
    }
    this.mapStatusService.updateExportingStatus(false);
    return pngData;
  }

  /**
   * Exports the dashboard to PNG
   *
   * @param elementRef Source element to export as png
   * @param pngName Exported png file name
   */
  public async pngExporter(
    elementRef: ElementRef,
    pngName: string
  ): Promise<void> {
    let format: 'png' | 'jpeg';
    let includeHeaderFooter: boolean;
    const data = {
      exportType: 'image',
    };

    // this.mapReadyForExportSubscription?.unsubscribe();

    // Open the DashboardExportActionComponent dialog
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data,
    });

    // Sets the user input values from dialog box
    dialogRef.closed.subscribe(async (result) => {
      if (result !== true && result !== undefined) {
        const resultValue = result as {
          format: 'png' | 'jpeg';
          includeHeaderFooter: boolean;
        };
        const snackbarRef = this.startSpinSnackbar(
          this.translate.instant('common.notifications.export.loading', {
            type: resultValue.format.toUpperCase(),
          })
        );

        // Sets exporting status to true
        this.mapStatusService.updateExportingStatus(true);

        if (this.mapExistsInExportComponent(elementRef)) {
          this.mapStatusService.mapReadyForExport$
            .pipe(
              filter((ready) => ready === true), // Waits until map is ready
              first()
            )
            .subscribe(async () => {
              // Sets 0.5 second timeout to ensure the map layer is fully loaded
              setTimeout(async () => {
                format = resultValue.format;
                includeHeaderFooter = resultValue.includeHeaderFooter;

                // Draws the Dashboard in its current state
                const pngData = await this.pngDrawer(
                  elementRef,
                  pngName,
                  includeHeaderFooter
                );
                saveAs(pngData, `${pngName}.${format}`);
                await this.mapStatusService.clearLoadedMaps();
              }, 500);
            });
        } else {
          format = resultValue.format;
          includeHeaderFooter = resultValue.includeHeaderFooter;
          const pngData = await this.pngDrawer(
            elementRef,
            pngName,
            includeHeaderFooter
          );
          saveAs(pngData, `${pngName}.${format}`);
          await this.mapStatusService.clearLoadedMaps();
        }
        snackbarRef.instance.dismiss();
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.export.image', {
            image: resultValue.format.toUpperCase(),
          }),
          { duration: 700 }
        );
      }
    });
  }
}
