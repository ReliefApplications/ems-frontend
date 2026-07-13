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
  debounceTime,
  filter,
  first,
  iif,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { SnackbarSpinnerComponent } from '../snackbar-spinner/snackbar-spinner.component';
import { DashboardExportService } from '../../services/dashboard-export/dashboard-export.service';
import {
  LocalizedString,
  resolveLocalizedString,
} from '../../models/localized-string.model';

/** Uniform page margin applied when exporting to A4. */
const A4_EXPORT_MARGIN = '1cm';
/** A4 page width in PDF points ( kendo-drawing maps 1 CSS px to 1pt ). */
const A4_WIDTH_PT = 595;
/** Points per centimeter ( 72pt / 2.54cm ), used to size the A4 margin. */
const PT_PER_CM = 72 / 2.54;

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
  /** Document title (plain string or per-locale map) */
  @Input() title?: LocalizedString;
  /** Wrapper element where exporter will be put into */
  private wrapper: any;

  /** @returns Document title resolved against the current UI language. */
  private get resolvedTitle(): string {
    console.log(this.title);
    return resolveLocalizedString(this.title, this.translate.currentLang);
  }

  /**
   * Shared dashboard export button.
   * Open a menu.
   *
   * @param document Document
   * @param dialog CDK Dialog
   * @param translate Angular translate service
   * @param snackBar Shared snackbar service
   * @param renderer Angular renderer
   * @param dashboardExportService Dashboard export service
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dialog: Dialog,
    private translate: TranslateService,
    private snackBar: SnackbarService,
    private renderer: Renderer2,
    private dashboardExportService: DashboardExportService
  ) {}

  /**
   * Open PDF exporter modal.
   * Call PDF export if user confirms export.
   */
  public async pdfExporter(): Promise<void> {
    this.dashboardExportService.mapLoadedCount.next(0);

    const { DashboardExportModalComponent } = await import(
      '../dashboard-export-modal/dashboard-export-modal.component'
    );
    const dialogRef = this.dialog.open(DashboardExportModalComponent, {
      data: {
        exportType: 'pdf',
      },
    });

    dialogRef.closed
      .pipe(
        filter((result) => result !== true && result !== undefined),
        map((result) => {
          return result as {
            includeHeaderFooter: boolean;
            paperSize: string;
          };
        }),
        tap(() => this.dashboardExportService.isExportingSubject.next(true)),
        switchMap((result) =>
          iif(
            () => this.numberOfMaps() > 0,
            this.dashboardExportService.mapLoadedCount$.pipe(
              filter((count) => count >= this.numberOfMaps()),
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
   * Generate and save pdf with given configuration and data
   *
   * @param resultValue PDF configuration.
   * @param resultValue.includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param resultValue.paperSize PDF size.
   */
  private async savePdf(resultValue: {
    includeHeaderFooter: boolean;
    paperSize: string;
  }) {
    const pdfData = await this.pdfDrawer(resultValue);
    saveAs(pdfData, `${this.resolvedTitle}.pdf`);
    this.dashboardExportService.isExportingSubject.next(false);
    // this.currentDialogSubscriptions?.unsubscribe();
  }

  /**
   * Draw PDF.
   * Create a wrapper to put all elements in it.
   *
   * @param pdfConfig PDF configuration
   * @param pdfConfig.includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param pdfConfig.paperSize PDF size.
   * @returns {Promise<string>} PDF data.
   */
  private async pdfDrawer(pdfConfig: {
    includeHeaderFooter: boolean;
    paperSize: string;
  }): Promise<string> {
    this.createWrapper();
    const { includeHeaderFooter, paperSize } = pdfConfig;
    const isA4 = paperSize === 'A4';
    let a4StyleEl: HTMLStyleElement | null = null;
    try {
      if (includeHeaderFooter) {
        this.addHeaderAndFooter();
      }

      const drawOptions: Record<string, unknown> = { paperSize };
      if (isA4) {
        a4StyleEl = this.applyA4ExportLayout();
        Object.assign(drawOptions, {
          landscape: false,
          margin: A4_EXPORT_MARGIN,
          keepTogether: 'gridster-item',
          scale: this.getA4Scale(),
        });
      }

      const drawing = await drawDOM(this.wrapper, drawOptions);
      return await exportPDF(drawing);
    } finally {
      if (includeHeaderFooter) {
        this.removeHeaderAndFooter();
      }
      if (a4StyleEl) {
        this.removeA4ExportLayout(a4StyleEl);
      }
      this.removeWrapper();
    }
  }

  /**
   * Computes the scale factor so the wrapper's content fits within the
   * printable width of an A4 page ( page width minus margins ), capped at 1
   * so smaller content is never scaled up.
   *
   * @returns Scale factor to pass to drawDOM.
   */
  private getA4Scale(): number {
    const printableWidthPt = A4_WIDTH_PT - PT_PER_CM * 2;
    const contentWidth = this.wrapper.scrollWidth;
    if (!contentWidth) {
      return 1;
    }
    return Math.min(1, printableWidthPt / contentWidth);
  }

  /**
   * Applies a temporary export layout so gridster widgets, which are
   * normally absolutely positioned in a grid, stack vertically in a
   * single column for A4 pagination.
   *
   * @returns The injected style element, to be removed after export via
   * removeA4ExportLayout.
   */
  private applyA4ExportLayout(): HTMLStyleElement {
    this.renderer.addClass(this.wrapper, 'pdf-a4-export');
    const style = this.renderer.createElement('style');
    style.innerHTML = `
      .pdf-a4-export gridster {
        height: auto !important;
        width: 100% !important;
        display: block !important;
      }
      .pdf-a4-export gridster-item {
        position: relative !important;
        display: block !important;
        width: 100% !important;
        left: 0 !important;
        top: 0 !important;
        transform: none !important;
        margin: 0 0 16px 0 !important;
      }
    `;
    this.renderer.appendChild(this.document.head, style);
    return style;
  }

  /**
   * Removes the temporary A4 export layout styles applied by
   * applyA4ExportLayout, restoring the dashboard to its normal grid layout.
   *
   * @param style Style element previously injected by applyA4ExportLayout.
   */
  private removeA4ExportLayout(style: HTMLStyleElement): void {
    this.renderer.removeClass(this.wrapper, 'pdf-a4-export');
    this.renderer.removeChild(this.document.head, style);
  }

  /**
   * Open image exporter modal.
   * Call image export if user confirms export.
   */
  public async imageExporter(): Promise<void> {
    this.dashboardExportService.mapLoadedCount.next(0);

    const { DashboardExportModalComponent } = await import(
      '../dashboard-export-modal/dashboard-export-modal.component'
    );
    const dialogRef = this.dialog.open(DashboardExportModalComponent, {
      data: {
        exportType: 'image',
      },
    });

    dialogRef.closed
      .pipe(
        filter((result) => result !== true && result !== undefined),
        map((result) => {
          return result as {
            format: 'png' | 'jpeg';
            includeHeaderFooter: boolean;
          };
        }),
        tap(() => this.dashboardExportService.isExportingSubject.next(true)),
        switchMap((result) =>
          iif(
            () => this.numberOfMaps() > 0,
            this.dashboardExportService.mapLoadedCount$.pipe(
              filter((count) => count >= this.numberOfMaps()),
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
   * Generate and save image with given configuration and data
   *
   * @param resultValue Image configuration
   * @param resultValue.includeHeaderFooter Whether to include headers and footers in the image.
   * @param resultValue.format Format of generated image.
   */
  private async saveImage(resultValue: {
    format: 'png' | 'jpeg';
    includeHeaderFooter: boolean;
  }) {
    const { format, includeHeaderFooter } = resultValue;
    // Draws the Dashboard in its current state
    const pngData = await this.imageDrawer(includeHeaderFooter);
    saveAs(pngData, `${this.resolvedTitle}.${format}`);
    this.dashboardExportService.isExportingSubject.next(false);
    // this.currentDialogSubscriptions?.unsubscribe();
  }

  /**
   * Draw image.
   * Create a wrapper to put all elements in it.
   *
   * @param includeHeaderFooter Whether to include a header and footer in the image.
   * @returns {Promise<string>} Image data.
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
    const pageTitle = this.resolvedTitle;
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
   * Provide number of map elements
   *
   * @returns Number of map elements in provided native element
   */
  private numberOfMaps(): number {
    return this.exporter.nativeElement.querySelectorAll('shared-map')?.length;
  }

  /**
   * Create a wrapper to encapsulate exporter native element.
   */
  private createWrapper() {
    const originalElement = this.exporter.nativeElement;
    const parent = originalElement.parentNode;
    this.wrapper = this.renderer.createElement('div');
    while (originalElement.firstChild) {
      this.renderer.appendChild(this.wrapper, originalElement.firstChild);
    }
    this.renderer.insertBefore(parent, this.wrapper, originalElement);
  }

  /**
   * Remove wrapper that encapsulated exporter native element.
   */
  private removeWrapper() {
    const originalElement = this.exporter.nativeElement;
    const parent = originalElement.parentNode;
    while (this.wrapper.firstChild) {
      this.renderer.appendChild(originalElement, this.wrapper.firstChild);
    }
    this.renderer.removeChild(parent, this.wrapper);
  }
}
