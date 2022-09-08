import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { Record } from '../../../../../models/record.model';
import { parseHtml } from '../../../summary-card/parser/utils';
import { QueryBuilderService } from '../../../../../services/query-builder.service';

/**
 * Component used in the card-modal-settings for previewing the final result.
 */
@Component({
  selector: 'safe-preview-tab',
  templateUrl: './preview-tab.component.html',
  styleUrls: ['./preview-tab.component.scss'],
})
export class SafePreviewTabComponent implements OnChanges {
  @Input() html = '';
  @Input() record: Record | null = null;
  @Input() layout: any;

  public formattedHtml?: SafeHtml;

  /**
   * Constructor used by the SafePreviewTab component.
   *
   * @param apollo Service used for getting the record queries.
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param queryBuilder Service used for building custom query.
   */
  constructor(
    private apollo: Apollo,
    private sanitizer: DomSanitizer,
    private queryBuilder: QueryBuilderService
  ) {}

  /**
   * Detects when the html or record inputs change.
   */
  async ngOnChanges() {
    let record = this.record;
    const query = this.layout?.query;

    if (query) {
      const builtQuery = this.queryBuilder.buildQuery({ query });

      const res = await this.apollo
        .query<any>({
          query: builtQuery,
          variables: {
            first: 1,
            filter: query.filter,
            sort: query.sort,
          },
        })
        .toPromise();

      if (res.data) {
        record = res.data[query.name].edges[0]?.node;
      }
    }
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.html, record)
    );
  }
}
