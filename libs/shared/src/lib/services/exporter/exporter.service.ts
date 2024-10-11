import { Dialog } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { ComponentRef, ElementRef, Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { drawDOM, exportImage, exportPDF } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  first,
  iif,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { DashboardExportActionComponent } from '../../components/dashboard-export-action/dashboard-export-action.component';
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
  /** BehaviorSubject that holds the current status of the pdf or image export.*/
  private isExportingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  /** Observable that observes true if the pdf or image export is in progress. */
  public isExporting$: Observable<boolean> =
    this.isExportingSubject.asObservable();

  /**
   * BehaviourSubject that is set to true true if all the maps on the dashboard
   * are loaded and ready for exporting.
   */
  private mapReadyForExportSubject = new BehaviorSubject<boolean>(false);
  /** Observable that observes true if the pdf or image export is in progress. */
  public mapReadyForExport$: Observable<boolean> =
    this.mapReadyForExportSubject.asObservable();

  /** BehaviorSubject that holds the count of loaded maps during current dashboard export. */
  private mapLoadedCount = new BehaviorSubject<number>(0);
  /** Current elementRef to export */
  private currentElementRefToExport!: ElementRef;
  /** Current open dialog subscriptions */
  private currentDialogSubscriptions!: Subscription;

  /**
   * Exporter service to create png/pdf files from DOM element
   *
   * @param document Document token
   * @param dialog Angular CDK dialog
   * @param translate Translate service
   * @param snackBar Snackbar service
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dialog: Dialog,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {}

  /**
   * Check if any map component exists in the given element source
   *
   * @returns Map components number of items in given source element
   */
  private mapExistsInExportComponent(): number {
    const hasMaps =
      this.currentElementRefToExport.nativeElement.querySelectorAll(
        'shared-map'
      )?.length;
    return hasMaps;
  }

  /**
   * Checks if all the maps on the dashboard are loaded and ready for exporting.
   */
  private allMapsLoaded(): void {
    const allMapsLoaded =
      this.mapExistsInExportComponent() === this.mapLoadedCount.value;
    if (allMapsLoaded) {
      this.mapReadyForExportSubject.next(allMapsLoaded);
    }
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
   * Adds header and footer to the top and bottom of a
   * PDF and Image export.
   *
   * @param elementName Source element name
   */
  private addHeaderAndFooter(elementName: string): void {
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
    this.currentElementRefToExport.nativeElement.prepend(header);
    this.currentElementRefToExport.nativeElement.append(footer);
  }

  /**
   * Removes header and footer from pdf and image export.
   */
  private removeHeaderAndFooter(): void {
    const header = this.currentElementRefToExport.nativeElement.firstChild;
    const footer = this.currentElementRefToExport.nativeElement.lastChild;
    this.currentElementRefToExport.nativeElement.removeChild(header);
    this.currentElementRefToExport.nativeElement.removeChild(footer);
  }

  /**
   * This method generates a PDF with the user input provided parameters.
   *
   * @param fileName Pdf file name
   * @param pdfConfig Pdf configuration
   * @param pdfConfig.includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param pdfConfig.paperSize The size of the PDF to be generated.
   * @returns {Promise<string>} A promise that resolves to a string representing the PDF data.
   */
  private async pdfDrawer(
    fileName: string,
    pdfConfig: {
      includeHeaderFooter: boolean;
      paperSize: string;
    }
  ): Promise<string> {
    const { includeHeaderFooter, paperSize } = pdfConfig;
    if (includeHeaderFooter) {
      this.addHeaderAndFooter(fileName);
    }
    const drawing = await drawDOM(
      this.currentElementRefToExport.nativeElement,
      {
        paperSize,
      }
    );
    const pdfData = await exportPDF(drawing);
    if (includeHeaderFooter) {
      this.removeHeaderAndFooter();
    }
    return pdfData;
  }

  /**
   * Generate and save pdf with given configuration and data
   *
   * @param pdfName Pdf file name
   * @param resultValue Pdf configuration
   * @param resultValue.includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param resultValue.paperSize The size of the PDF to be generated.
   */
  private async savePdf(
    pdfName: string,
    resultValue: { includeHeaderFooter: boolean; paperSize: string }
  ) {
    const pdfData = await this.pdfDrawer(pdfName, resultValue);
    saveAs(pdfData, `${pdfName}.pdf`);
    this.isExportingSubject.next(false);
    this.currentDialogSubscriptions?.unsubscribe();
  }

  /**
   * Generate and save png with given configuration and data
   *
   * @param imageName Image file name
   * @param resultValue Image configuration
   * @param resultValue.includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param resultValue.format The format of the image to be generated.
   */
  private async saveImage(
    imageName: string,
    resultValue: { format: 'png' | 'jpeg'; includeHeaderFooter: boolean }
  ) {
    const { format, includeHeaderFooter } = resultValue;
    // Draws the Dashboard in its current state
    const pngData = await this.imageDrawer(imageName, includeHeaderFooter);
    saveAs(pngData, `${imageName}.${format}`);
    this.isExportingSubject.next(false);
    this.currentDialogSubscriptions?.unsubscribe();
  }

  /**
   * This function draws a PNG image from the current state of the dashboard.
   *
   * @param fileName Png file name
   * @param includeHeaderFooter Whether to include a header and footer in the image.
   * @returns {Promise<string>} A promise that resolves to a string representing the PNG data.
   */
  private async imageDrawer(
    fileName: string,
    includeHeaderFooter: boolean
  ): Promise<string> {
    if (includeHeaderFooter) {
      this.addHeaderAndFooter(fileName);
    }
    const background = this.currentElementRefToExport.nativeElement.style.color;
    this.currentElementRefToExport.nativeElement.style.background = '#fff';
    const drawing = await drawDOM(
      this.currentElementRefToExport.nativeElement,
      {
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
      }
    );
    this.currentElementRefToExport.nativeElement.style.background = background;
    const pngData = await exportImage(drawing);
    if (includeHeaderFooter) {
      this.removeHeaderAndFooter();
    }
    return pngData;
  }

  /**
   * Exports the dashboard to image
   *
   * @param elementRef Source element to export as image
   * @param imageName Exported image file name
   */
  public async imageExporter(
    elementRef: ElementRef,
    imageName: string
  ): Promise<void> {
    this.currentElementRefToExport = elementRef;
    const data = {
      exportType: 'image',
    };
    this.mapLoadedCount.next(0);
    // Open the DashboardExportActionComponent dialog
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data,
    });
    this.currentDialogSubscriptions = new Subscription();
    // Sets the user input values from dialog box
    this.currentDialogSubscriptions.add(
      dialogRef.closed
        .pipe(
          filter((result) => result !== true && result !== undefined),
          map((result) => {
            return result as {
              format: 'png' | 'jpeg';
              includeHeaderFooter: boolean;
            };
          }),
          tap(() => this.isExportingSubject.next(true)),
          switchMap((result) =>
            iif(
              () => this.mapExistsInExportComponent() > 0,
              this.mapReadyForExport$.pipe(
                // Sets 0.5 second timeout to ensure the map layer is fully loaded
                filter((ready) => !!ready),
                debounceTime(500),
                first(),
                map(() => result)
              ),
              of(result)
            )
          )
        )
        .subscribe(async (result) => {
          const snackbarRef = this.startSpinSnackbar(
            this.translate.instant('common.notifications.export.loading', {
              type: result.format.toUpperCase(),
            })
          );
          this.saveImage(imageName, result);
          snackbarRef.instance.dismiss();
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.export.image', {
              image: result.format.toUpperCase(),
            }),
            { duration: 700 }
          );
        })
    );
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
    this.currentElementRefToExport = elementRef;
    const data = {
      exportType: 'pdf',
    };
    this.mapLoadedCount.next(0);
    // Open the DashboardExportActionComponent dialog
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data,
    });
    this.currentDialogSubscriptions = new Subscription();
    // Handle the dialog result
    this.currentDialogSubscriptions.add(
      dialogRef.closed
        .pipe(
          filter((result) => result !== true && result !== undefined),
          map((result) => {
            return result as {
              includeHeaderFooter: boolean;
              paperSize: string;
            };
          }),
          tap(() => this.isExportingSubject.next(true)),
          switchMap((result) =>
            iif(
              () => this.mapExistsInExportComponent() > 0,
              this.mapReadyForExport$.pipe(
                // Sets 0.5 second timeout to ensure the map layer is fully loaded
                filter((ready) => !!ready),
                debounceTime(500),
                first(),
                map(() => result)
              ),
              of(result)
            )
          )
        )
        .subscribe(async (result) => {
          const snackbarRef = this.startSpinSnackbar(
            this.translate.instant('common.notifications.export.loading', {
              type: 'PDF',
            })
          );
          await this.savePdf(pdfName, result);
          snackbarRef.instance.dismiss();
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.export.pdf'),
            { duration: 700 }
          );
        })
    );
  }

  /**
   * Increments the count of loaded maps during current dashboard export.
   */
  public incrementMapLoadedCount(): void {
    this.mapLoadedCount.next(this.mapLoadedCount.value + 1);
    this.allMapsLoaded();
  }
}
