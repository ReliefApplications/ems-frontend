import { Inject, Injectable } from '@angular/core';
import get from 'lodash/get';
import { RestService } from '../rest/rest.service';
import { DOCUMENT } from '@angular/common';
import { ShadowDomService } from '@oort-front/ui';

/**
 * Shared widget service.
 * Handles common operations, like:
 * - adding custom style
 */
@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  /**
   * Shared widget service.
   *
   * @param restService Shared rest service
   * @param document Document reference
   * @param shadowDomService Shared shadow dom service
   */
  constructor(
    private restService: RestService,
    @Inject(DOCUMENT) private document: Document,
    private shadowDomService: ShadowDomService
  ) {}

  /**
   * Create custom style html element
   *
   * @param id id of widget or element to style
   * @param widget widget definition
   * @returns Promise with html style element ( if any )
   */
  public createCustomStyle(id: string, widget: any) {
    return new Promise<HTMLStyleElement | void>((resolve) => {
      // Get style from widget definition
      const style = get(widget, 'settings.widgetDisplay.style') || '';
      if (style) {
        const scss = `#${id} {
    ${style}
  }`;
        // Compile to css ( we store style as scss )
        this.restService
          .post('style/scss-to-css', { scss }, { responseType: 'text' })
          .subscribe((css) => {
            const customStyle = this.document.createElement('style');
            customStyle.appendChild(this.document.createTextNode(css));
            if (this.shadowDomService.isShadowRoot) {
              // Add it to shadow root
              this.shadowDomService.currentHost.appendChild(customStyle);
            } else {
              // Add to head of document
              const head = this.document.getElementsByTagName('head')[0];
              head.appendChild(customStyle);
            }
            resolve(customStyle);
          });
      }
      resolve();
    });
  }
}
