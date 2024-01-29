import { Inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DownloadService } from '../download/download.service';
import get from 'lodash/get';
import {
  getAggregationKeys,
  getCalcKeys,
  getCardStyle,
  getDataKeys,
  getPageKeys,
  parseHtml,
} from '../../utils/parser/utils';
import { ApplicationService } from '../application/application.service';
import { Application } from '../../models/application.model';
import { ContentType, Page } from '../../models/page.model';
import { RawEditorSettings } from 'tinymce';
import { LocationStrategy } from '@angular/common';

/**
 * Data template service
 * Used by summary card and text widget to render content / manage settings
 */
@Injectable({
  providedIn: 'root',
})
export class DataTemplateService {
  /** Current environment */
  private environment: any;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param downloadService Used to download file type fields
   * @param applicationService Shared application service
   * @param environment Current environment
   * @param locationStrategy Angular location strategy
   */
  constructor(
    private sanitizer: DomSanitizer,
    private downloadService: DownloadService,
    private applicationService: ApplicationService,
    @Inject('environment') environment: any,
    private locationStrategy: LocationStrategy
  ) {
    this.environment = environment;
  }

  /**
   * Get auto completer keys
   *
   * @param fields available fields
   * @param aggregations available aggregations
   * @returns available keys
   */
  public getAutoCompleterKeys(fields: any[], aggregations?: any[]) {
    return [
      ...getDataKeys(fields),
      ...getAggregationKeys(aggregations || []),
      ...getCalcKeys(),
    ];
  }

  /**
   * Get auto completer page keys
   *
   * @returns page keys for auto completer
   */
  public getAutoCompleterPageKeys() {
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    const pages = application?.pages || [];
    return getPageKeys(pages);
  }

  /**
   * Render HTML from definition
   *
   * @param html html template
   * @param options options
   * @param options.data content data
   * @param options.aggregation aggregation data
   * @param options.fields definition of fields
   * @param options.styles definition of styles
   * @returns html to render
   */
  public renderHtml(
    html: string,
    options: {
      data?: any;
      aggregation?: any;
      fields?: any[];
      styles?: any[];
    }
  ) {
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    return this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(html, {
        data: options.data,
        aggregation: options.aggregation,
        fields: options.fields,
        pages: this.getPages(application),
        styles: options.styles,
      })
    );
  }

  /**
   * Render link from definition
   *
   * @param href href value
   * @returns parsed href
   */
  public renderLink(href: string) {
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    return parseHtml(href, {
      pages: this.getPages(application),
    });
  }

  /**
   * Render style from definition
   *
   * @param allContent apply to whole content
   * @param data content data
   * @param styles definition of styles
   * @returns style to render
   */
  public renderStyle(allContent: boolean, data: any, styles: any[]) {
    return getCardStyle(allContent, data, styles);
  }

  /**
   * Handle click event
   *
   * @param event click event
   * @param data content data
   */
  onClick(event: any, data: any): void {
    const type = event.target.getAttribute('type');
    if (type === 'file') {
      // Download file from definition
      const fieldName = event.target.getAttribute('field');
      const index = event.target.getAttribute('index');
      const file = get(data, `${fieldName}[${index}]`, null);
      if (file) {
        const path = `download/file/${file.content}`;
        this.downloadService.getFile(path, file.type, file.name);
      }
    }
  }

  /**
   * Get button link using application page id
   *
   * @param pageId page id
   * @returns page url
   */
  public getButtonLink(pageId: string): string {
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    const pages = this.getPages(application);
    const page = pages.filter((page: any) => page.id === pageId);
    if (page) {
      return page[0].url;
    }
    return '';
  }

  /**
   * Get page url
   *
   * @param application application
   * @param page page to get url from
   * @returns url of the page
   */
  private getPageUrl(application: Application, page: Page): string {
    const baseHref = this.locationStrategy.getBaseHref();
    if (this.environment.module === 'backoffice') {
      return page.type === ContentType.form
        ? `${this.environment.backOfficeUri}/applications/${application.id}/${page.type}/${page.id}`
        : `${this.environment.backOfficeUri}/applications/${application.id}/${page.type}/${page.content}`;
    } else {
      return page.type === ContentType.form
        ? `.${baseHref}${application.id}/${page.type}/${page.id}`
        : `.${baseHref}${application.id}/${page.type}/${page.content}`;
    }
  }

  /**
   * Set editor link list using application pages
   *
   * @param editor current editor
   */
  public setEditorLinkList(editor: RawEditorSettings): void {
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    const pages = this.getPages(application);
    editor.link_list = pages.map((page) => ({
      title: page.name,
      value: page.placeholder,
    }));
  }

  /**
   * Get available pages from app
   *
   * @param application application
   * @returns list of pages and their url
   */
  private getPages(application: Application | null) {
    return (
      application?.pages?.map((page) => ({
        id: page.id,
        name: page.name,
        url: this.getPageUrl(application, page),
        placeholder: `{{page(${page.id})}}`,
      })) || []
    );
  }
}
