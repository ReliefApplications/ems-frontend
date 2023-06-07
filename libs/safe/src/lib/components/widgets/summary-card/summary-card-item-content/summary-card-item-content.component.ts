import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeDownloadService } from '../../../../services/download/download.service';
import { getCardStyle, parseHtml } from '../parser/utils';
import get from 'lodash/get';
import { Router } from '@angular/router';
import { ToPageFromWidgetService } from '../../../../services/to-page-from-widget/to-page-from-widget.service';
import { SafeSnackBarService } from '../../../../services/snackbar/snackbar.service';

/**
 * Content component of Single Item of Summary Card.
 * Build html from item definition and queried record.
 */
@Component({
  selector: 'safe-summary-card-item-content',
  templateUrl: './summary-card-item-content.component.html',
  styleUrls: ['./summary-card-item-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryCardItemContentComponent implements OnInit, OnChanges {
  @Input() html = '';
  @Input() fields: any[] = [];
  @Input() fieldsValue: any;
  @Input() styles: any[] = [];
  @Input() wholeCardStyles = false;
  @Input() makeCardClickable: any;
  @Input() pageToLink?: any;

  public formattedHtml?: SafeHtml;
  resultText = '';
  public environment: any;
  public cardStyle?: string;
  private currentAppId: string;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param environment Environment specific data
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param downloadService Used to download file type fields
   * @param router Angular Router
   * @param toPageService Used to handle redirecting to pages from widgets
   * @param snackBar Shared snackbar service
   */
  constructor(
    @Inject('environment') environment: any,
    private sanitizer: DomSanitizer,
    private downloadService: SafeDownloadService,
    private router: Router,
    private toPageService: ToPageFromWidgetService,
    private snackBar: SafeSnackBarService
  ) {
    this.environment = environment;
    //Get current app ID through the url of the current page
    if (this.router.url.includes('applications/')) {
      this.currentAppId = this.router.url.split('/')[2];
    } else {
      const urlAfterApp = this.router.url.substring(
        this.router.url.lastIndexOf(
          this.environment.frontOfficeUri + 'applications/'
        ) + 1
      );
      this.currentAppId = urlAfterApp.split('/')[1];
    }
  }

  async ngOnInit(): Promise<void> {
    this.cardStyle = getCardStyle(
      this.wholeCardStyles,
      this.styles,
      this.fieldsValue
    );
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      await this.toPageService.applyPage(
        parseHtml(this.html, this.fieldsValue, this.fields, this.styles)
      )
    );
  }

  /**
   * Detects when the html or record inputs change.
   */
  async ngOnChanges() {
    this.cardStyle = getCardStyle(
      this.wholeCardStyles,
      this.styles,
      this.fieldsValue
    );
    const parsedHtml = parseHtml(
      this.html,
      this.fieldsValue,
      this.fields,
      this.styles
    );
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      await this.toPageService.applyPage(parsedHtml)
    );
  }

  /**
   * Manages all data types that require some extra functions
   *
   * @param event Click event
   */
  public async onClick(event: any) {
    const type = event.target.getAttribute('type');
    if (this.makeCardClickable) {
      const sameApp = await this.toPageService.checkPageApplication(
        this.pageToLink,
        this.currentAppId
      );
      if (sameApp) {
        try {
          const pageInfo = await this.toPageService.getPageInfo(
            this.pageToLink,
            this.currentAppId
          );
          this.router.navigate([pageInfo.url]);
        } catch {
          this.snackBar.openSnackBar('Redirecting to page was unsuccessful', {
            error: true,
          });
        }
      } else {
        this.snackBar.openSnackBar(
          'Cannot redirect to page outside application',
          {
            error: true,
          }
        );
      }
    }
    if (type === 'file') {
      const fieldName = event.target.getAttribute('field');
      const index = event.target.getAttribute('index');
      const file = get(this.fieldsValue, `${fieldName}[${index}]`, null);
      if (file) {
        const path = `download/file/${file.content}`;
        this.downloadService.getFile(path, file.type, file.name);
      }
    }
  }
}
