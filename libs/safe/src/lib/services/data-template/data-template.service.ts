import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeDownloadService } from '../download/download.service';
import get from 'lodash/get';
import { getCardStyle, parseHtml } from '../../utils/parser/utils';

/**
 * Data template service
 * Used by summary card and text widget to render content / manage settings
 */
@Injectable({
  providedIn: 'root',
})
export class DataTemplateService {
  /**
   * Content component of Single Item of Summary Card.
   *
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param downloadService Used to download file type fields
   */
  constructor(
    private sanitizer: DomSanitizer,
    private downloadService: SafeDownloadService
  ) {}

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
    return this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(html, data, fields, styles)
    );
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
}
