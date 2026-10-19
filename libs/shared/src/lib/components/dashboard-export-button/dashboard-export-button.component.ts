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
import {
  drawDOM,
  exportPDF,
  exportImage,
  geometry,
  Group,
  Path,
} from '@progress/kendo-drawing';
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

/** PDF export configuration, as returned by the export modal */
interface PdfExportConfig {
  /** Whether to include headers and footers in the PDF. */
  includeHeaderFooter: boolean;
  /** Paper size ( 'auto' for a single page fitting all the content ). */
  paperSize: string;
  /** Page orientation, only used with a fixed paper size. */
  orientation?: 'portrait' | 'landscape';
}

/** Paper sizes ( in points ), portrait orientation */
const PAPER_SIZES: Record<string, [number, number]> = {
  A4: [595.28, 841.89],
};

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
        map((result) => result as PdfExportConfig),
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
   */
  private async savePdf(resultValue: PdfExportConfig) {
    const pdfData = await this.pdfDrawer(resultValue);
    saveAs(pdfData, `${this.resolvedTitle}.pdf`);
    this.dashboardExportService.isExportingSubject.next(false);
    // this.currentDialogSubscriptions?.unsubscribe();
  }

  /**
   * Draw PDF.
   * Create a wrapper to put all elements in it.
   * With a fixed paper size, content is scaled down to fit the page width
   * and split into as many pages as needed.
   *
   * @param pdfConfig PDF configuration
   * @returns {Promise<string>} PDF data.
   */
  private async pdfDrawer(pdfConfig: PdfExportConfig): Promise<string> {
    this.createWrapper();
    const { includeHeaderFooter, paperSize, orientation } = pdfConfig;
    if (includeHeaderFooter) {
      this.addHeaderAndFooter();
    }

    let pdfData: string;
    if (paperSize === 'auto') {
      const drawing = await drawDOM(this.wrapper, { paperSize });
      pdfData = await exportPDF(drawing);
    } else {
      const landscape = orientation === 'landscape';
      // No margin, as for the 'auto' paper size: content uses the full page
      const [pageWidth, pageHeight] = this.getPageSize(paperSize, landscape);
      const scale = this.getPdfScale(pageWidth);
      // Height of the dashboard box once scaled, taken from the DOM, as
      // elements sticking out of the box ( fixed or negatively positioned )
      // would otherwise offset the pages
      const boxHeight =
        Math.max(
          this.wrapper.scrollHeight,
          this.wrapper.getBoundingClientRect().height
        ) * scale;
      // Draw the whole content once, as a single scaled drawing
      const drawing = await drawDOM(this.wrapper, { scale });
      // The box can be taller than its content ( e.g. stretched to fill the
      // screen ), which would add an empty page at the end: stop at the
      // bottom of what is actually drawn
      const drawnBottom = drawing.bbox()?.bottomRight().y ?? boxHeight;
      const pages = this.paginate(
        drawing,
        pageWidth,
        pageHeight,
        Math.min(boxHeight, drawnBottom)
      );
      pdfData = await exportPDF(pages, {
        multiPage: true,
        paperSize,
        landscape,
      });
    }

    if (includeHeaderFooter) {
      this.removeHeaderAndFooter();
    }
    this.removeWrapper();
    return pdfData;
  }

  /**
   * Get page size, in points.
   *
   * @param paperSize Paper size ( e.g. 'A4' )
   * @param landscape Whether the page is in landscape orientation
   * @returns [width, height] in points
   */
  private getPageSize(paperSize: string, landscape: boolean): [number, number] {
    const size = PAPER_SIZES[paperSize.toUpperCase()] ?? PAPER_SIZES['A4'];
    const [short, long] = [Math.min(...size), Math.max(...size)];
    return landscape ? [long, short] : [short, long];
  }

  /**
   * Get scale to apply so the exported content fits the page width.
   * Content is never scaled up.
   *
   * @param availableWidth Page width, in points
   * @returns Scale factor, between 0 and 1
   */
  private getPdfScale(availableWidth: number): number {
    // Kendo treats 1 CSS px as 1 pt, so points can be compared to DOM sizes
    const contentWidth = Math.max(
      this.wrapper.scrollWidth,
      this.wrapper.getBoundingClientRect().width
    );
    if (!contentWidth || contentWidth <= availableWidth) {
      return 1;
    }
    return availableWidth / contentWidth;
  }

  /**
   * Split a drawing into pages.
   * Each page is a clipped & translated view of the same drawing, so the
   * DOM is only drawn once.
   *
   * @param drawing Drawing of the whole content, origin at its top left
   * @param contentWidth Page width, in points
   * @param contentHeight Page height, in points
   * @param totalHeight Height of the whole content, in points
   * @returns Group of pages, to export as a multi-page PDF
   */
  private paginate(
    drawing: Group,
    contentWidth: number,
    contentHeight: number,
    totalHeight: number
  ): Group {
    const pages = new Group();
    let top = 0;
    // Guard against infinite loops with degenerate sizes, and ignore a
    // remainder of less than a point, which would only produce a blank page
    while (top + 1 < totalHeight && contentHeight > 0) {
      const next = top + contentHeight;
      const page = new Group({
        clip: Path.fromRect(
          new geometry.Rect([0, 0], [contentWidth, contentHeight])
        ),
      });
      const view = new Group({
        transform: geometry.transform().translate(0, -top),
      });
      // Share the drawing between pages without re-parenting it,
      // as Kendo does internally when rendering pages
      view.children = [drawing];
      page.append(view);
      pages.append(page);
      top = next;
    }
    return pages;
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
