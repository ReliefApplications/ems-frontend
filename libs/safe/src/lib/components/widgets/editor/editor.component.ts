import { Component, OnInit, Input } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
import {
  GET_RESOURCE_METADATA,
  GetResourceMetadataQueryResponse,
} from '../summary-card/graphql/queries';
import { get } from 'lodash';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { DatatemplateService } from '../../../services/datatemplate/datatemplate.service';

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
   * @param apollo Apollo instance
   * @param queryBuilder Query builder service
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private dataTemplateService: DatatemplateService,
  ) {}

  /** Sanitizes the text. */
  ngOnInit(): void {
    if (!this.settings.record) {
      this.safeHtml = this.dataTemplateService.renderHtml(
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
    const result = await this.dataTemplateService.getStyles(this.settings.layout, this.settings.resource);
    if(result){
      this.layout = result; 
      this.styles = result?.query.style;
    }
    await this.getData();

    this.safeHtml = this.dataTemplateService.renderHtml(this.settings.text, this.fieldsValue, this.fields, this.styles);

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
