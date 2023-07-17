import { Inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeDownloadService } from '../download/download.service';
import get from 'lodash/get';
import {
  getCalcKeys,
  getCardStyle,
  getDataKeys,
  getPageKeys,
  parseHtml,
} from '../../utils/parser/utils';
import { SafeApplicationService } from '../application/application.service';
import { Application } from '../../models/application.model';
import { ContentType, Page } from '../../models/page.model';
import { RawEditorSettings } from 'tinymce';

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
   */
  constructor(
    private sanitizer: DomSanitizer,
    private downloadService: SafeDownloadService,
    private applicationService: SafeApplicationService,
    @Inject('environment') environment: any
  ) {
    this.environment = environment;
  }

  /**
   * Get auto completer keys
   *
   * @param fields available fields
   * @returns available keys
   */
  public getAutoCompleterKeys(fields: any[]) {
    return [...getDataKeys(fields), ...getCalcKeys()];
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
   * @param data content data
   * @param fields definition of fields
   * @param styles definition of styles
   * @returns html to render
   */
  public renderHtml(html: string, data?: any, fields?: any[], styles?: any[]) {
    // Add available pages to the list of available keys
    const application = this.applicationService.application.getValue();
    return this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(html, data, fields, this.getPages(application), styles)
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
    return parseHtml(href, null, [], this.getPages(application), []);
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
    if (this.environment.module === 'backoffice') {
      return page.type === ContentType.form
        ? `${this.environment.backOfficeUri}/applications/${application.id}/${page.type}/${page.id}`
        : `${this.environment.backOfficeUri}/applications/${application.id}/${page.type}/${page.content}`;
    } else {
      return page.type === ContentType.form
        ? `${this.environment.frontOfficeUri}/${application.id}/${page.type}/${page.id}`
        : `${this.environment.frontOfficeUri}/${application.id}/${page.type}/${page.content}`;
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
