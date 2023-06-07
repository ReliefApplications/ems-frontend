import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { parseHtml } from '../summary-card/parser/utils';
import { firstValueFrom } from 'rxjs';
import {
  GET_LAYOUT,
  GET_RESOURCE_METADATA,
  GetLayoutQueryResponse,
  GetResourceMetadataQueryResponse,
} from '../summary-card/graphql/queries';
import { get } from 'lodash';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';

/**
 * Text widget component using KendoUI
 */
@Component({
  selector: 'safe-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class SafeEditorComponent implements OnInit {
  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() settings: any;

  private layout: any;
  private fields: any[] = [];
  private fieldsValue: any;
  private styles: any[] = [];

  // === TEXT SANITIZED ===
  public safeHtml: SafeHtml = '';

  /**
   * Constructor for safe-editor component
   *
   * @param sanitizer Dom sanitizer instance
   * @param apollo Apollo instance
   * @param queryBuilder Query builder service
   */
  constructor(
    private sanitizer: DomSanitizer,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService
  ) {}

  /** Sanitizes the text. */
  ngOnInit(): void {
    if (!this.settings.record) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
        this.settings.text
      );
    } else {
      this.setContentFromLayout();
    }
  }

  /**
   * Sets content of the text widget, querying associated record.
   */
  private async setContentFromLayout(): Promise<void> {
    await this.getStyles();
    await this.getData();

    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.settings.text, this.fieldsValue, this.fields, this.styles)
    );
  }

  /** Sets layout style. */
  private async getStyles(): Promise<void> {
    const apolloRes = await firstValueFrom(
      this.apollo.query<GetLayoutQueryResponse>({
        query: GET_LAYOUT,
        variables: {
          id: this.settings.layout,
          resource: this.settings.resource,
        },
      })
    );
    if (get(apolloRes, 'data')) {
      this.layout = apolloRes.data.resource.layouts?.edges[0].node;
      this.styles = this.layout?.query.style;
    }
  }

  /**
   * Queries the data.
   */
  private async getData() {
    const metaRes = await firstValueFrom(
      this.apollo.query<GetResourceMetadataQueryResponse>({
        query: GET_RESOURCE_METADATA,
        variables: {
          id: this.settings.resource,
        },
      })
    );
    const queryName = get(metaRes, 'data.resource.queryName');

    const builtQuery = this.queryBuilder.buildQuery({
      query: this.layout.query,
    });
    const layoutFields = this.layout.query.fields;
    this.fields = get(metaRes, 'data.resource.metadata', []).map((f: any) => {
      const layoutField = layoutFields.find((lf: any) => lf.name === f.name);
      if (layoutField) {
        return { ...layoutField, ...f };
      }
      return f;
    });

    if (builtQuery) {
      const res = await firstValueFrom(
        this.apollo.query<any>({
          query: builtQuery,
          variables: {
            first: 1,
            filter: {
              // get only the record we need
              logic: 'and',
              filters: [
                {
                  field: 'id',
                  operator: 'eq',
                  value: this.settings.record,
                },
              ],
            },
          },
        })
      );
      const record: any = get(res.data, `${queryName}.edges[0].node`, null);
      this.fieldsValue = { ...record };
    }
  }
}
