import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import {
  GET_LAYOUT,
  GET_RESOURCE_METADATA,
  GetLayoutQueryResponse,
  GetResourceMetadataQueryResponse,
} from '../summary-card/graphql/queries';
import { get } from 'lodash';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { DataTemplateService } from '../../../services/data-template/data-template.service';

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
  private wholeCardStyles = false;

  public formattedHtml: SafeHtml = '';
  public formattedStyle?: string;

  /**
   * Constructor for safe-editor component
   *
   * @param sanitizer Dom sanitizer instance
   * @param apollo Apollo instance
   * @param queryBuilder Query builder service
   * @param dataTemplateService Shared data template service, used to render content from template
   */
  constructor(
    private sanitizer: DomSanitizer,
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private dataTemplateService: DataTemplateService
  ) {}

  /** Sanitizes the text. */
  ngOnInit(): void {
    if (!this.settings.record) {
      this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
        this.settings.text
      );
    } else {
      this.setContentFromLayout();
    }
  }

  /**
   * Sets content of the text widget, querying associated record if any.
   */
  private async setContentFromLayout(): Promise<void> {
    if (this.settings.record) {
      await Promise.all([this.getStyles(), this.getData()]);
      this.formattedStyle = this.dataTemplateService.renderStyle(
        this.wholeCardStyles,
        this.fieldsValue,
        this.styles
      );
      this.formattedHtml = this.dataTemplateService.renderHtml(
        this.settings.text,
        this.fieldsValue,
        this.fields,
        this.styles
      );
    } else {
      this.formattedHtml = this.dataTemplateService.renderHtml(
        this.settings.text
      );
    }
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

  /**
   * Pass click event to data template service
   *
   * @param event Click event
   */
  public onClick(event: any) {
    this.dataTemplateService.onClick(event, this.fieldsValue);
  }
}
