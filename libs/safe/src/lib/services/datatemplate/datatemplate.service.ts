import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeDownloadService } from '../download/download.service';
import {
  parseHtml,
  getCardStyle,
} from '../../components/widgets/summary-card/parser/utils';
import get from 'lodash/get';
import { GET_LAYOUT, GetLayoutQueryResponse } from './graphql/queries';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

/**
 * Service to render html and style
 */
export class DatatemplateService {
  /**
   * Content component of Single Item of Summary Card.
   *
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param downloadService Used to download file type fields
   * @param apollo Apollo instance
   */
  constructor(
    private sanitizer: DomSanitizer,
    private downloadService: SafeDownloadService,
    private apollo: Apollo
  ) {}

  /**
   * render the html
   */
  public renderHtml(
    html: string,
    fieldsValue?: any,
    fields?: any[],
    styles?: any[]
  ) {
    return this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(html, fieldsValue, fields, styles)
    );
  }

  /**
   * render the style
   */
  public renderStyle(
    wholeCardStyles: boolean,
    styles: any[],
    fieldsValue: any
  ) {
    return getCardStyle(wholeCardStyles, styles, fieldsValue);
  }

  /**
   * Manages all data types that require some extra functions
   *
   */
  onClick(event: any, fieldsValue: any): void {
    const type = event.target.getAttribute('type');
    if (type === 'file') {
      const fieldName = event.target.getAttribute('field');
      const index = event.target.getAttribute('index');
      const file = get(fieldsValue, `${fieldName}[${index}]`, null);
      if (file) {
        const path = `download/file/${file.content}`;
        this.downloadService.getFile(path, file.type, file.name);
      }
    }
  }

  /** Sets layout style. */
  public async getStyles(id: any, resource: any): Promise<any> {
    const apolloRes = await firstValueFrom(
      this.apollo.query<GetLayoutQueryResponse>({
        query: GET_LAYOUT,
        variables: {
          id: id,
          resource: resource,
        },
      })
    );

    if (get(apolloRes, 'data')) {
      return apolloRes.data.resource.layouts?.edges[0].node;
    } else {
      return null;
    }
  }
}
