import {
  Component,
  ComponentRef,
  ElementRef,
  Inject,
  Input,
  Renderer2,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ButtonModule,
  IconModule,
  MenuModule,
  SnackbarService,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import { drawDOM, exportPDF, exportImage } from '@progress/kendo-drawing';
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
  switchMap,
  tap,
} from 'rxjs';
import { DashboardExportActionComponent } from '../dashboard-export-action/dashboard-export-action.component';
import { SnackbarSpinnerComponent } from '../snackbar-spinner/snackbar-spinner.component';

/**
 * Shared dashboard export button.
 * Open a menu.
 */
@Component({
  selector: 'shared-dashboard-export-button',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MenuModule,
    TooltipModule,
    IconModule,
    TranslateModule,
  ],
  templateUrl: './dashboard-export-button.component.html',
  styleUrls: ['./dashboard-export-button.component.scss'],
})
export class DashboardExportButtonComponent {
  /** Element to export */
  @Input() exporter!: ElementRef;
  /** Document title */
  @Input() title?: string;
  private wrapper: any;
  /** BehaviorSubject that holds the current status of the pdf or image export.*/
  private isExportingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  /**
   * BehaviorSubject that is set to true true if all the maps on the dashboard
   * are loaded and ready for exporting.
   */
  private mapReadyForExportSubject = new BehaviorSubject<boolean>(false);
  /** Observable that observes true if the pdf or image export is in progress. */
  public mapReadyForExport$: Observable<boolean> =
    this.mapReadyForExportSubject.asObservable();
  /** BehaviorSubject that holds the count of loaded maps during current dashboard export. */
  private mapLoadedCount = new BehaviorSubject<number>(0);

  /**
   * Shared dashboard export button.
   * Open a menu.
   *
   * @param document Document
   * @param dialog CDK Dialog
   * @param translate Angular translate service
   * @param snackBar Shared snackbar service
   * @param renderer Angular renderer
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dialog: Dialog,
    private translate: TranslateService,
    private snackBar: SnackbarService,
    private renderer: Renderer2
  ) {}

  /**
   * Saves the dashboard as a PDF file.
   */
  public async pdfExporter(): Promise<void> {
    const data = {
      exportType: 'pdf',
    };
    this.mapLoadedCount.next(0);

    // Open dashboard export modal
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data,
    });

    // Handle the dialog result
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
              filter((ready) => !!ready),
              // Sets 0.5 second timeout to ensure the map layer is fully loaded
              debounceTime(500),
              first(),
              map(() => result)
            ),
            of(result)
          )
        )
      )
      .subscribe(async (result: any) => {
        console.log(result);
        const snackBarRef = this.createLoadingSnackBar(
          this.translate.instant('common.notifications.export.loading', {
            type: 'PDF',
          })
        );
        await this.savePdf(result);
        snackBarRef.instance.dismiss();
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.export.pdf'),
          { duration: 700 }
        );
      });
  }

  /**
   * Exports the dashboard to image ( png or jpeg )
   *
   */
  public async imageExporter(): Promise<void> {
    const data = {
      exportType: 'image',
    };
    this.mapLoadedCount.next(0);

    // Open the DashboardExportActionComponent dialog
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data,
    });

    // Sets the user input values from dialog box
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
              filter((ready) => !!ready),
              // Sets 0.5 second timeout to ensure the map layer is fully loaded
              debounceTime(500),
              first(),
              map(() => result)
            ),
            of(result)
          )
        )
      )
      .subscribe(async (result) => {
        const snackbarRef = this.createLoadingSnackBar(
          this.translate.instant('common.notifications.export.loading', {
            type: result.format.toUpperCase(),
          })
        );
        this.saveImage(result);
        snackbarRef.instance.dismiss();
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.export.image', {
            image: result.format.toUpperCase(),
          }),
          { duration: 700 }
        );
      });
  }

  /**
   * Generate and save pdf with given configuration and data
   *
   * @param resultValue Pdf configuration
   * @param resultValue.includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param resultValue.paperSize The size of the PDF to be generated.
   */
  private async savePdf(resultValue: {
    includeHeaderFooter: boolean;
    paperSize: string;
  }) {
    const pdfData = await this.pdfDrawer(resultValue);
    saveAs(pdfData, `${this.title}.pdf`);
    this.isExportingSubject.next(false);
    // this.currentDialogSubscriptions?.unsubscribe();
  }

  /**
   * This method generates a PDF with the user input provided parameters.
   *
   * @param pdfConfig Pdf configuration
   * @param pdfConfig.includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param pdfConfig.paperSize The size of the PDF to be generated.
   * @returns {Promise<string>} A promise that resolves to a string representing the PDF data.
   */
  private async pdfDrawer(pdfConfig: {
    includeHeaderFooter: boolean;
    paperSize: string;
  }): Promise<string> {
    this.createWrapper();
    const { includeHeaderFooter, paperSize } = pdfConfig;
    if (includeHeaderFooter) {
      this.addHeaderAndFooter();
    }

    const drawing = await drawDOM(this.wrapper, {
      paperSize,
    });
    const pdfData = await exportPDF(drawing);
    if (includeHeaderFooter) {
      this.removeHeaderAndFooter();
    }
    this.removeWrapper();
    return pdfData;
  }

  /**
   * Generate and save png with given configuration and data
   *
   * @param resultValue Image configuration
   * @param resultValue.includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param resultValue.format The format of the image to be generated.
   */
  private async saveImage(resultValue: {
    format: 'png' | 'jpeg';
    includeHeaderFooter: boolean;
  }) {
    const { format, includeHeaderFooter } = resultValue;
    // Draws the Dashboard in its current state
    const pngData = await this.imageDrawer(includeHeaderFooter);
    saveAs(pngData, `${this.title}.${format}`);
    this.isExportingSubject.next(false);
    // this.currentDialogSubscriptions?.unsubscribe();
  }

  /**
   * This function draws a PNG image from the current state of the dashboard.
   *
   * @param includeHeaderFooter Whether to include a header and footer in the image.
   * @returns {Promise<string>} A promise that resolves to a string representing the PNG data.
   */
  private async imageDrawer(includeHeaderFooter: boolean): Promise<string> {
    this.createWrapper();
    if (includeHeaderFooter) {
      this.addHeaderAndFooter();
    }
    const background = this.wrapper.style.color;
    this.wrapper.style.background = '#fff';
    const drawing = await drawDOM(this.wrapper, {
      margin: { top: 10, left: 10, right: 10, bottom: 10 },
    });
    this.wrapper.style.background = background;
    const pngData = await exportImage(drawing);
    if (includeHeaderFooter) {
      this.removeHeaderAndFooter();
    }
    this.removeWrapper();
    return pngData;
  }

  /**
   * Adds header and footer to the top and bottom of a
   * PDF and Image export.
   */
  private addHeaderAndFooter(): void {
    // Create header and footer elements
    const header = this.document.createElement('div');
    const footer = this.document.createElement('div');

    // Add date and time to header
    const dateTime = new Date();
    const dateTimeText =
      dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
    const pageTitle = this.title;
    header.innerHTML = `<span class="float-left">${dateTimeText}</span><span class="block text-center">${pageTitle}</span>`;

    // Add URL to footer
    const url = window.location.href;
    footer.innerHTML = `<span class="text-center">${url}</span>`;

    // Append header and footer to the dashboard
    this.wrapper.prepend(header);
    this.wrapper.append(footer);
  }

  /**
   * Removes header and footer from pdf and image export.
   */
  private removeHeaderAndFooter(): void {
    const header = this.wrapper.firstChild;
    const footer = this.wrapper.lastChild;
    this.wrapper.removeChild(header);
    this.wrapper.removeChild(footer);
  }

  /**
   * Create a snackbar with loader
   *
   * @param message for snackbar
   * @returns spinner ref
   */
  private createLoadingSnackBar(message: string): ComponentRef<any> {
    // Create a snackbar to indicate file is processing
    return this.snackBar.openComponentSnackBar(SnackbarSpinnerComponent, {
      duration: 0,
      data: {
        message,
        loading: true,
      },
    });
  }

  /**
   * Check if any map component exists in the given element source
   *
   * @returns Map components number of items in given source element
   */
  private mapExistsInExportComponent(): number {
    const hasMaps =
      this.exporter.nativeElement.querySelectorAll('shared-map')?.length;
    return hasMaps;
  }

  private createWrapper() {
    const originalElement = this.exporter.nativeElement;
    const parent = originalElement.parentNode;
    this.wrapper = this.renderer.createElement('div');
    while (originalElement.firstChild) {
      this.renderer.appendChild(this.wrapper, originalElement.firstChild);
    }
    this.renderer.insertBefore(parent, this.wrapper, originalElement);
    // this.renderer.removeChild(parent, originalElement);
  }

  private removeWrapper() {
    const originalElement = this.exporter.nativeElement;
    const parent = originalElement.parentNode;
    while (this.wrapper.firstChild) {
      this.renderer.appendChild(originalElement, this.wrapper.firstChild);
    }
    this.renderer.removeChild(parent, this.wrapper);
  }
}
